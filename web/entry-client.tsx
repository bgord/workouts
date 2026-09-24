import { RouterClient } from "@tanstack/react-router/ssr/client";
import { hydrateRoot } from "react-dom/client";
import { createRouter } from "./router";

const router = createRouter({
  request: null,
  nonce: "",
  assetVersion: "",
  assets: { entry: "/public/entry-client.js", preloads: {} },
});

hydrateRoot(document, <RouterClient router={router} />);
