import { BlobServiceClient } from "@azure/storage-blob";

const DEFAULT_CONTAINER_NAME = "analysis-sessions";
const MAX_PAYLOAD_BYTES = 512 * 1024;

let blobServiceClient: BlobServiceClient | null = null;

function getBlobServiceClient() {
  if (blobServiceClient !== null) {
    return blobServiceClient;
  }

  const connectionString =
    process.env.ANALYSIS_BLOB_CONNECTION_STRING ??
    process.env.AzureWebJobsStorage;
  if (!connectionString) {
    throw new Error(
      "ANALYSIS_BLOB_CONNECTION_STRING or AzureWebJobsStorage is not configured.",
    );
  }

  blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  return blobServiceClient;
}

function readSessionFields(payload: unknown) {
  const entry = payload as {
    session?: { meta?: { sessionId?: string; startedAtIso?: string } };
  };
  return {
    sessionId: entry.session?.meta?.sessionId ?? "unknown-session",
    startedAtIso: entry.session?.meta?.startedAtIso ?? new Date().toISOString(),
  };
}

export async function writeAnalysisSession(payload: unknown, userId: string) {
  const serialized = JSON.stringify({
    kind: "session-snapshot",
    writtenAtIso: new Date().toISOString(),
    userId,
    ...((typeof payload === "object" && payload !== null ? payload : {}) as
      | Record<string, unknown>
      | undefined),
  });
  const bytes = Buffer.byteLength(serialized, "utf8");
  if (bytes > MAX_PAYLOAD_BYTES) {
    throw new Error("Analysis payload is too large.");
  }

  const { sessionId, startedAtIso } = readSessionFields(payload);
  const safeSessionId = sessionId.replace(/[^a-zA-Z0-9._-]/g, "-");
  const date = startedAtIso.slice(0, 10);
  const containerName =
    process.env.ANALYSIS_BLOB_CONTAINER ?? DEFAULT_CONTAINER_NAME;
  const container = getBlobServiceClient().getContainerClient(containerName);
  await container.createIfNotExists();

  const blobName = `${userId}/${date}/${safeSessionId}-${Date.now()}.json`;
  const blob = container.getBlockBlobClient(blobName);
  await blob.upload(serialized, bytes, {
    blobHTTPHeaders: {
      blobContentType: "application/json",
    },
  });

  return blobName;
}
