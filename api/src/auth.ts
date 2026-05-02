import type { HttpRequest } from "@azure/functions";

export interface ClientPrincipal {
  identityProvider: string;
  userId: string;
  userDetails: string;
  userRoles: string[];
}

export function getClientPrincipal(request: HttpRequest) {
  const encoded = request.headers.get("x-ms-client-principal");
  if (!encoded) {
    return null;
  }

  try {
    const decoded = Buffer.from(encoded, "base64").toString("utf8");
    const principal = JSON.parse(decoded) as Partial<ClientPrincipal>;
    if (
      typeof principal.userId !== "string" ||
      typeof principal.userDetails !== "string" ||
      typeof principal.identityProvider !== "string" ||
      !Array.isArray(principal.userRoles)
    ) {
      return null;
    }

    return {
      identityProvider: principal.identityProvider,
      userId: principal.userId,
      userDetails: principal.userDetails,
      userRoles: principal.userRoles.filter(
        (role): role is string => typeof role === "string",
      ),
    };
  } catch {
    return null;
  }
}
