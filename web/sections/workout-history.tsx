import * as bg from "@bgord/ui";
import * as ui from "../components";
import { workoutsRoute } from "../router";
import * as ShortcutDefinitions from "../services/shortcuts";
import { WorkoutHistoryEmpty } from "./workout-history-empty";
import { WorkoutHistoryFilters } from "./workout-history-filters";

export function WorkoutHistory() {
  const { workouts } = workoutsRoute.useLoaderData();
  const navigate = workoutsRoute.useNavigate();
  const search = workoutsRoute.useSearch();

  const matching = workouts.data.filter(
    (workout) => !search.section || workout.planSectionId === search.section,
  );

  bg.useShortcuts({
    [ShortcutDefinitions.OpenWorkout.trigger]: () => {
      if (matching[0]) {
        navigate({ params: { workoutId: matching[0].id }, search, to: "/workouts/$workoutId" });
      }
    },
  });

  if (workouts.data.length === 0) return null;

  return (
    <div data-stack="y" {...ui.Gap.block}>
      <WorkoutHistoryFilters matching={matching} />

      <WorkoutHistoryEmpty matching={matching} />

      <ul data-stack="y" {...ui.Gap.cluster}>
        {matching.map((workout) => (
          <ui.WorkoutCard key={workout.id} {...workout} />
        ))}
      </ul>
    </div>
  );
}
