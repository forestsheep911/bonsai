import {
  type HttpRequest,
  type InvocationContext,
  app,
} from "@azure/functions";
import { getClientPrincipal } from "../auth.js";
import { jsonResponse } from "../responses.js";

export async function me(request: HttpRequest, _context: InvocationContext) {
  const principal = getClientPrincipal(request);

  return jsonResponse(200, {
    ok: true,
    user:
      principal === null
        ? null
        : {
            identityProvider: principal.identityProvider,
            userId: principal.userId,
            userDetails: principal.userDetails,
            userRoles: principal.userRoles,
          },
  });
}

app.http("me", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "me",
  handler: me,
});
