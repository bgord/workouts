import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { eq } from "drizzle-orm";
import * as v from "valibot";
import * as Auth from "+auth";
import * as Facilities from "+facilities";
import { bootstrap } from "+infra/bootstrap";
import { db } from "+infra/db";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import * as Schema from "+infra/schema";
import * as mocks from "../tests/mocks";

const tables = [
  Schema.events,
  Schema.facilities,
  Schema.locations,
  Schema.locationFrames,
  Schema.motionAlarms,
  Schema.locationAlarmSettings,
  Schema.history,
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
    const users = await Promise.all(
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

    const facilities = ["Home", "Work"].map((name) => ({
      id: v.parse(Facilities.VO.FacilityId, di.Adapters.System.IdProvider.generate()),
      name: v.parse(Facilities.VO.FacilityName, name),
    }));

    for (const row of facilities) {
      const facility = Facilities.Aggregates.Facility.create(
        row.id,
        row.name,
        users[0]?.user.id as Auth.VO.UserIdType,
        di.Adapters.System,
      );

      await di.Tools.EventStore.save(facility.pullEvents());
    }

    const location = Facilities.Aggregates.Location.register(
      v.parse(Facilities.VO.LocationId, di.Adapters.System.IdProvider.generate()),
      v.parse(Facilities.VO.LocationName, "Door_entrance"),
      facilities[0]?.id as Facilities.VO.FacilityIdType,
      mocks.ingestionKeyHash,
      users[0]?.user.id as Auth.VO.UserIdType,
      di.Adapters.System,
    );

    await di.Tools.EventStore.save(location.pullEvents());

    await Bun.sleep(tools.Duration.Ms(10).ms);

    process.exit(0);
  });
})();
