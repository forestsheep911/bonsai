import { type Container, CosmosClient } from "@azure/cosmos";

export interface CloudSaveDocument {
  id: string;
  userId: string;
  slotId: string;
  saveVersion: number;
  scenarioId: string;
  appBuild: string;
  updatedAtIso: string;
  save: unknown;
}

export interface CloudSaveSummary {
  slotId: string;
  scenarioId: string;
  saveVersion: number;
  appBuild: string;
  updatedAtIso: string;
  etag?: string;
}

const DEFAULT_DATABASE_NAME = "bonsai";
const DEFAULT_CONTAINER_NAME = "saves";
const VALID_SLOT_IDS = new Set(["auto", "manual-1"]);

let containerPromise: Promise<Container> | null = null;

export function isValidSlotId(slotId: string) {
  return VALID_SLOT_IDS.has(slotId);
}

export function getSaveDocumentId(userId: string, slotId: string) {
  return `${userId}:${slotId}`;
}

function getContainer() {
  if (containerPromise !== null) {
    return containerPromise;
  }

  const connectionString = process.env.COSMOS_DB_CONNECTION_STRING;
  if (!connectionString) {
    throw new Error("COSMOS_DB_CONNECTION_STRING is not configured.");
  }

  const databaseName =
    process.env.COSMOS_DB_DATABASE_NAME ?? DEFAULT_DATABASE_NAME;
  const containerName =
    process.env.COSMOS_DB_SAVES_CONTAINER ?? DEFAULT_CONTAINER_NAME;
  const client = new CosmosClient(connectionString);

  containerPromise = client.databases
    .createIfNotExists({ id: databaseName })
    .then(({ database }) =>
      database.containers.createIfNotExists({
        id: containerName,
        partitionKey: {
          paths: ["/userId"],
        },
      }),
    )
    .then(({ container }) => container);

  return containerPromise;
}

export function readSaveMetadata(value: unknown) {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const candidate = value as {
    version?: unknown;
    snapshot?: {
      scenarioId?: unknown;
    };
  };

  if (
    typeof candidate.version !== "number" ||
    typeof candidate.snapshot !== "object" ||
    candidate.snapshot === null ||
    typeof candidate.snapshot.scenarioId !== "string"
  ) {
    return null;
  }

  return {
    saveVersion: candidate.version,
    scenarioId: candidate.snapshot.scenarioId,
  };
}

export async function listSaves(userId: string): Promise<CloudSaveSummary[]> {
  const container = await getContainer();
  const query = {
    query:
      "SELECT c.slotId, c.scenarioId, c.saveVersion, c.appBuild, c.updatedAtIso FROM c WHERE c.userId = @userId ORDER BY c.updatedAtIso DESC",
    parameters: [{ name: "@userId", value: userId }],
  };
  const { resources } = await container.items
    .query<CloudSaveSummary>(query, { partitionKey: userId })
    .fetchAll();
  return resources;
}

export async function readSave(userId: string, slotId: string) {
  const container = await getContainer();
  const { resource, headers } = await container
    .item(getSaveDocumentId(userId, slotId), userId)
    .read<CloudSaveDocument>();

  if (resource === undefined) {
    return null;
  }

  return {
    document: resource,
    etag: headers.etag as string | undefined,
  };
}

export async function upsertSave(
  userId: string,
  slotId: string,
  save: unknown,
  appBuild: string,
  ifMatch?: string,
) {
  const metadata = readSaveMetadata(save);
  if (metadata === null) {
    throw new Error("Invalid SaveGameData payload.");
  }

  const container = await getContainer();
  const document: CloudSaveDocument = {
    id: getSaveDocumentId(userId, slotId),
    userId,
    slotId,
    saveVersion: metadata.saveVersion,
    scenarioId: metadata.scenarioId,
    appBuild,
    updatedAtIso: new Date().toISOString(),
    save,
  };

  const options =
    ifMatch === undefined
      ? undefined
      : {
          accessCondition: {
            type: "IfMatch" as const,
            condition: ifMatch,
          },
        };

  const { resource, headers } = await container.items.upsert(document, options);

  if (resource === undefined) {
    throw new Error("Cosmos DB did not return a saved document.");
  }

  return {
    document: resource,
    etag: headers.etag as string | undefined,
  };
}
