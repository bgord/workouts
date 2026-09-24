import type * as bg from "@bgord/bun";
import { createRequestHandler, defaultRenderHandler } from "@tanstack/react-router/ssr/server";
import type { BuildInfoType } from "../infra/tools/build-info-config.adapter";
import { createRouter } from "./router";

export async function handler(
  request: Request,
  nonce: bg.NonceValueType,
  build: BuildInfoType,
): Promise<Response> {
  return createRequestHandler({
    request,
    createRouter: () => createRouter({ request, nonce, build }),
  })(defaultRenderHandler);
}
