import { describe, expect, test } from "bun:test";
import { Hono } from "hono";
import { StaticFileStrategyImmutable } from "+infra/tools/static-file-immutable.strategy";

describe("StaticFileStrategyImmutable", () => {
  const app = new Hono().get("*", (c) => {
    StaticFileStrategyImmutable(`./${c.req.path}`, c);
    return c.text("");
  });

  test("hashed chunk", async () => {
    const response = await app.request("/public/workout-gd6xhfej.js");

    expect(response.headers.get("Cache-Control")).toEqual("public, max-age=31536000, immutable");
  });

  test("versioned", async () => {
    const response = await app.request("/public/custom.css?v=1abc");

    expect(response.headers.get("Cache-Control")).toEqual("public, max-age=31536000, immutable");
  });

  test("unversioned", async () => {
    const response = await app.request("/public/custom.css");

    expect(response.headers.get("Cache-Control")).toEqual("public, max-age=300, must-revalidate");
  });

  test("unversioned - fixed name script", async () => {
    const response = await app.request("/public/entry-client.js");

    expect(response.headers.get("Cache-Control")).toEqual("public, max-age=300, must-revalidate");
  });
});
