import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

const hashed = /-[a-z0-9]{8}\.js$/;

const MustRevalidate = bg.StaticFileStrategyMustRevalidate(tools.Duration.Minutes(5));

export const StaticFileStrategyImmutable: typeof bg.StaticFileStrategyNoop = (path, c) => {
  if (hashed.test(path) || c.req.query("v")) {
    return c.header("Cache-Control", `public, max-age=${tools.Duration.Days(365).seconds}, immutable`);
  }

  return MustRevalidate(path, c);
};
