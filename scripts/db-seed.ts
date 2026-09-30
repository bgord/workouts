import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { eq, is } from "drizzle-orm";
import { SQLiteTable } from "drizzle-orm/sqlite-core";
import * as v from "valibot";
import * as Auth from "+auth";
import { bootstrap } from "+infra/bootstrap";
import { db } from "+infra/db";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import * as Schema from "+infra/schema";
import { seedCatalog } from "./seed/catalog";
import * as fixtures from "./seed/fixtures";

const tables = Object.values(Schema).filter((value) => is(value, SQLiteTable));

void (async function main() {
  for (const table of tables) await db.delete(table);

  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);

  const now = di.Adapters.System.Clock.now();
  const correlationId = v.parse(bg.CorrelationId, di.Adapters.System.IdProvider.generate());

  await bg.CorrelationStorage.run(correlationId, async () => {
    await seedCatalog(di);

    for (const persona of fixtures.personas) {
      const result = await di.Tools.Auth.config.api.signUpEmail({
        body: { email: persona.email, name: persona.email, password: fixtures.password },
      });

      await db.update(Schema.users).set({ emailVerified: true }).where(eq(Schema.users.email, persona.email));

      const event = bg.event(
        Auth.Events.AccountCreatedEvent,
        `account_${result.user.id}`,
        { userId: v.parse(Auth.VO.UserId, result.user.id), timestamp: now.ms },
        deps,
      );

      await di.Tools.EventStore.save([event]);

      console.log(`[✓] ${persona.email} created`);
    }

    await Bun.sleep(tools.Duration.Ms(10).ms);

    process.exit(0);
  });
})();
