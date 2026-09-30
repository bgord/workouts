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
import { seedActive } from "./seed/personas/active";
import { seedArchivist } from "./seed/personas/archivist";
import { seedAthlete } from "./seed/personas/athlete";
import { seedBuilder } from "./seed/personas/builder";
import { seedDisposable } from "./seed/personas/disposable";
import { seedDrafter } from "./seed/personas/drafter";
import { seedEmpty } from "./seed/personas/empty";
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

    await seedEmpty(di);
    await seedBuilder(di);
    await seedDrafter(di);
    await seedAthlete(di);
    await seedActive(di);
    await seedArchivist(di);
    await seedPolyglot(di);
    await seedDisposable(di);

    await Bun.sleep(tools.Duration.Ms(10).ms);

    process.exit(0);
  });
})();
