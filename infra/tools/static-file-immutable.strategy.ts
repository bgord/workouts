import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

type StaticFilesStrategy = typeof bg.StaticFileStrategyNoop;

const hashed = /-[a-z0-9]{8}\.js$/;

export const StaticFileStrategyImmutable: (fallback: StaticFilesStrategy) => StaticFilesStrategy =
  (fallback) => (path, c) => {
    if (hashed.test(path) || c.req.query("v")) {
      return c.header("Cache-Control", `public, max-age=${tools.Duration.Days(365).seconds}, immutable`);
    }

    return fallback(path, c);
  };
