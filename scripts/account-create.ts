import * as tools from "@bgord/tools";
import * as v from "valibot";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { AccountCreator } from "./account-creator";

void (async function main() {
  const di = await bootstrap();

  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);

  try {
    const email = v.parse(tools.Email, Bun.argv[2]);

    const result = await new AccountCreator({
      ...di.Adapters.System,
      ...di.Tools,
      Auth: di.Tools.Auth.config,
    }).create(email);

    di.Adapters.System.Logger.info({
      message: "Account credentials",
      component: "infra",
      operation: "account_create",
      metadata: { email, initialPassword: result.password },
    });
  } catch (error) {
    di.Adapters.System.Logger.error({
      message: "Account create failed",
      component: "infra",
      operation: "account_create",
      error,
    });

    process.exitCode = 1;
  }
})();
