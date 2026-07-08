import type * as bg from "@bgord/bun";
import type { TimingVariables } from "hono/timing";
import type { AuthVariables } from "+infra/tools/shield-auth.strategy";

export type Config = {
  Variables: TimingVariables &
    bg.TimeZoneOffsetVariables &
    bg.WeakETagVariables &
    bg.CorrelationVariables &
    bg.LanguageDetectorVariables &
    AuthVariables;
};

export * as config from "./config";
