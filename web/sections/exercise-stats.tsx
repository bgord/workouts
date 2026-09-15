import { useTranslations } from "@bgord/ui";
import { CalendarCheck, EqualApproximately, Sigma, Trophy } from "lucide-react";
import { Form as WorkoutHistoryFilters } from "../../app/services/workout-history-filters-form";
import type { ExercisePerformance } from "../../modules/statistics/value-objects/exercise-performance";
import { RepsLoad } from "../components/reps-load";
import { Tile, TileContext, TileHeader, TileLink, TileValue } from "../components/tile";
import { WeightFormat } from "../services/weight-format";

export function ExerciseStats(props: { performances: Array<ExercisePerformance> }) {
  const t = useTranslations();

  const best = props.performances.toSorted((a, b) => b.bestEstimate - a.bestEstimate)[0];
  const heaviest = props.performances.toSorted((a, b) => b.volume - a.volume)[0];
  const latest = props.performances.at(-1);

  if (!(best && heaviest && latest)) return null;

  const set = best.sets.toSorted((a, b) => b.estimate - a.estimate)[0];

  return (
    <ul data-gap="3" data-stack="x" data-wrap="wrap">
      <TileLink
        data-hover-bc="brand-500"
        params={{ workoutId: best.workoutId }}
        search={WorkoutHistoryFilters.default}
        to="/workouts/$workoutId"
      >
        <TileHeader>
          <Trophy data-color="brand-400" data-size="xs" />
          <div data-cross="center" data-stack="x">
            <EqualApproximately data-color="neutral-600" data-size="xs" />
            {t("statistics.exercise.one_rep_max_estimate")}
          </div>
        </TileHeader>

        <TileValue>
          {t("statistics.exercise.one_rep_max_estimate.value", {
            load: WeightFormat.kilograms(best.bestEstimate),
          })}
        </TileValue>

        {set && (
          <TileContext>
            <RepsLoad load={set.load} reps={set.reps} />
          </TileContext>
        )}
      </TileLink>

      <Tile>
        <TileHeader>
          <Sigma data-size="xs" />
          {t("statistics.exercise.volume")}
        </TileHeader>

        <TileValue>
          {t("statistics.exercise.history.volume_load.value", {
            load: WeightFormat.kilograms(heaviest.volume),
          })}
        </TileValue>

        <TileContext>{heaviest.scheduledFor}</TileContext>
      </Tile>

      <Tile>
        <TileHeader>
          <CalendarCheck data-size="xs" />
          {t("statistics.exercise.sessions")}
        </TileHeader>

        <TileValue>{props.performances.length}</TileValue>

        <TileContext>{latest.scheduledFor}</TileContext>
      </Tile>
    </ul>
  );
}
