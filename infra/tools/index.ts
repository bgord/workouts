import * as bg from "@bgord/bun";
import type { EnvironmentResultType } from "+infra/env";
import { createBuildInfoConfig } from "./build-info-config.adapter";
import { createCommandBus } from "./command-bus";
import { createCronScheduler } from "./cron-scheduler.adapter";
import { createEventBus } from "./event-bus";
import { createEventHandler } from "./event-handler";
import { createEventStore } from "./event-store";
import { createEventStreamEraser } from "./event-stream-eraser";
import { HashContent } from "./hash-content.strategy";
import { createShieldBasicAuth } from "./shield-basic-auth.strategy";
import { createShieldCaptcha } from "./shield-captcha.strategy";
import { createShieldRateLimit } from "./shield-rate-limit.strategy";
import { createShieldSecurity } from "./shield-security.strategy";
import { ShieldTimeout } from "./shield-timeout.strategy";
import { createTranslationsProvider } from "./translations-provider.adapter";

type Dependencies = {
  Clock: bg.ClockPort;
  Logger: bg.LoggerPort;
  FileReaderJson: bg.FileReaderJsonPort;
  Sleeper: bg.SleeperPort;
};

export async function createTools(Env: EnvironmentResultType, deps: Dependencies) {
  const EventBus = createEventBus(deps);
  const EventStore = createEventStore(Env, { ...deps, EventBus });
  const CronScheduler = await createCronScheduler(Env, deps);
  const TranslationsProvider = createTranslationsProvider(Env, { HashContent, ...deps });
  const BuildInfoConfig = createBuildInfoConfig(Env, deps);
  const CommitConfig = new bg.StaticConfigAdapter<bg.CommitShaValueType>((await BuildInfoConfig.get()).sha);

  return {
    CronScheduler,
    ShieldBasicAuth: createShieldBasicAuth(Env),
    ShieldCaptcha: createShieldCaptcha(Env),
    ShieldRateLimit: createShieldRateLimit(Env, { ...deps, HashContent }),
    ShieldTimeout,
    EventHandler: createEventHandler(deps),
    CommandBus: createCommandBus(deps),
    EventBus,
    EventStore,
    EventStreamEraser: createEventStreamEraser(Env),
    ShieldSecurity: createShieldSecurity(Env, { ...deps, HashContent }),
    BuildInfoConfig,
    CommitConfig,
    HashContent,
    TranslationsProvider,
  };
}
