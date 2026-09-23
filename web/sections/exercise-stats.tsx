import * as bg from "@bgord/ui";
import { CalendarCheck, EqualApproximately, Sigma, Trophy } from "lucide-react";
import { Form as WorkoutHistoryFilters } from "../../app/services/workout-history-filters-form";
import * as ui from "../components";
import { exerciseRoute } from "../router";
import { WeightFormat } from "../services/weight-format";

export function ExerciseStats() {
  const t = bg.useTranslations();
  const { performances } = exerciseRoute.useLoaderData();

  const best = performances.toSorted((a, b) => b.bestEstimate - a.bestEstimate)[0];
  const heaviest = performances.toSorted((a, b) => b.volume - a.volume)[0];
  const latest = performances.at(-1);

  if (!(best && heaviest && latest)) return null;

  return (
    <ul data-cross="stretch" data-stack="x" data-wrap="wrap" {...ui.Gap.related}>
      <ui.TileLink
        data-hover-bc="brand-500"
        params={{ workoutId: best.workoutId }}
        search={WorkoutHistoryFilters.default}
        to="/workouts/$workoutId"
      >
        <ui.TileHeader>
          <Trophy data-color="brand-400" data-size="xs" />
          <div data-stack="x">
            <EqualApproximately data-color="neutral-600" data-size="xs" />
            {t("statistics.exercise.one_rep_max_estimate")}
          </div>
        </ui.TileHeader>

        <ui.TileValue>
          {t("statistics.exercise.one_rep_max_estimate.value", {
            load: WeightFormat.kilograms(best.bestEstimate),
          })}
        </ui.TileValue>

        <ui.TileContext>
          <ui.RepsLoad load={best.bestSet.load} reps={best.bestSet.reps} />
        </ui.TileContext>
      </ui.TileLink>

      <ui.Tile>
        <ui.TileHeader>
          <Sigma data-size="xs" />
          {t("statistics.exercise.volume")}
        </ui.TileHeader>

        <ui.TileValue>
          {t("statistics.exercise.history.volume_load.value", {
            load: WeightFormat.kilograms(heaviest.volume),
          })}
        </ui.TileValue>

        <ui.TileContext>{heaviest.scheduledFor}</ui.TileContext>
      </ui.Tile>

      <ui.Tile>
        <ui.TileHeader>
          <CalendarCheck data-size="xs" />
          {t("statistics.exercise.sessions")}
        </ui.TileHeader>

        <ui.TileValue>{performances.length}</ui.TileValue>

        <ui.TileContext>{latest.scheduledFor}</ui.TileContext>
      </ui.Tile>
    </ul>
  );
}
