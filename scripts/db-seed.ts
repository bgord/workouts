import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { is } from "drizzle-orm";
import { SQLiteTable } from "drizzle-orm/sqlite-core";
import * as v from "valibot";
import { bootstrap } from "+infra/bootstrap";
import { db } from "+infra/db";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import * as Schema from "+infra/schema";
import { seedCatalog } from "./seed/catalog";
import { Clock, now, withClock } from "./seed/clock";
import * as fixtures from "./seed/fixtures";
import { seedActive } from "./seed/personas/active";
import { seedAdmin } from "./seed/personas/admin";
import { seedArchivist } from "./seed/personas/archivist";
import { seedAthlete } from "./seed/personas/athlete";
import { seedBuilder } from "./seed/personas/builder";
import { seedDisposable } from "./seed/personas/disposable";
import { seedDrafter } from "./seed/personas/drafter";
import { seedEmpty } from "./seed/personas/empty";
import { seedHanger } from "./seed/personas/hanger";
import { seedHoarder } from "./seed/personas/hoarder";
import { seedPocket } from "./seed/personas/pocket";
import { seedPolyglot } from "./seed/personas/polyglot";

const tables = Object.values(Schema).filter((value) => is(value, SQLiteTable));

void (async function main() {
  for (const table of tables) await db.delete(table);

  const di = await bootstrap();

  di.Adapters.System.Clock.now = () => Clock.now();

  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);

  const correlationId = v.parse(bg.CorrelationId, di.Adapters.System.IdProvider.generate());

  await bg.CorrelationStorage.run(correlationId, async () => {
    await withClock(new bg.ClockFixedAdapter(now.subtract(tools.Duration.Weeks(10))), () => seedCatalog(di));

    await seedAdmin(di);

    await seedEmpty(di, fixtures.empty);
    await seedEmpty(di, fixtures.emptyMutation);
    await seedBuilder(di, fixtures.builder);
    await seedBuilder(di, fixtures.builderMutation);
    await seedDrafter(di);
    await seedAthlete(di, fixtures.athlete);
    await seedAthlete(di, fixtures.athleteMutation);
    await seedActive(di, fixtures.active);
    await seedActive(di, fixtures.activeMutation);
    await seedArchivist(di, fixtures.archivist);
    await seedArchivist(di, fixtures.archivistMutation);
    await seedPolyglot(di, fixtures.polyglot);
    await seedPolyglot(di, fixtures.polyglotMutation);
    await seedDisposable(di);
    await seedHoarder(di);
    await seedPocket(di);
    await seedHanger(di);

    await di.Adapters.System.Sleeper.wait(tools.Duration.Ms(1));

    process.exit(0);
  });
})();
