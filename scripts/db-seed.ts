import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { eq } from "drizzle-orm";
import * as Auth from "+auth";
import { bootstrap } from "+infra/bootstrap";
import { db } from "+infra/db";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import * as Schema from "+infra/schema";

const tables = [
  Schema.events,
  Schema.userPreferences,
  Schema.accounts,
  Schema.users,
  Schema.sessions,
  Schema.verifications,
];

const people = [
  { email: "admin@example.com", password: "1234567890" },
  { email: "user@example.com", password: "1234567890" },
];

(async function main() {
  for (const table of tables) await db.delete(table);

  const di = await bootstrap();

  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);

  const now = di.Adapters.System.Clock.now();
  const correlationId = di.Adapters.System.IdProvider.generate();

  await bg.CorrelationStorage.run(correlationId, async () => {
    await Promise.all(
      people.map(async (person, index) => {
        const result = await di.Tools.Auth.config.api.signUpEmail({
          body: { email: person.email, name: person.email, password: person.password },
        });

        await db
          .update(Schema.users)
          .set({ emailVerified: true })
          .where(eq(Schema.users.email, person.email));

        const event = bg.event(
          Auth.Events.AccountCreatedEvent,
          `account_${result.user.id}`,
          { userId: result.user.id, timestamp: now.ms },
          di.Adapters.System,
        );

        await di.Tools.EventStore.save([event]);

        console.log(`[✓] User ${index + 1} created`);

        return result;
      }),
    );

    await Bun.sleep(tools.Duration.Ms(10).ms);

    process.exit(0);
  });
})();
