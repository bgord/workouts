import * as bg from "@bgord/ui";
import { CalendarCheck } from "lucide-react";
import * as ui from "../components";
import { ExerciseStatisticsKit } from "../kits/exercise-statistics.kit";
import { exerciseRoute } from "../router";

export function ExerciseStats() {
  const t = bg.useTranslations();
  const { exercise, performances, records } = exerciseRoute.useLoaderData();
  const Statistics = ExerciseStatisticsKit[exercise.data.resistance];

  const latest = performances.at(-1);

  /* v8 ignore next */
  if (!(latest && records)) return null;

  return (
    <ul data-cross="stretch" data-stack="x" data-wrap="wrap" {...ui.Gap.related}>
      <Statistics.Tiles records={records} />

      <ui.Tile>
        <ui.TileHeader>
          <CalendarCheck data-size="xs" />
          {t("statistics.exercise.sessions")}
        </ui.TileHeader>

        <ui.TileValue>{performances.length}</ui.TileValue>

        <ui.TileContext>
          <bg.DateTime format="freshness" value={latest.scheduledFor} />
        </ui.TileContext>
      </ui.Tile>
    </ul>
  );
}
