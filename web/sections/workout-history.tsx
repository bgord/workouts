import * as bg from "@bgord/ui";
import type { WorkoutListResponse } from "../../app/http/workouts/workout-list";
import * as ui from "../components";
import { workoutsRoute } from "../router";
import * as ShortcutDefinitions from "../services/shortcuts";
import { WorkoutHistoryEmpty } from "./workout-history-empty";
import { WorkoutHistoryFilters } from "./workout-history-filters";

export function WorkoutHistory() {
  const t = bg.useTranslations();
  const { workouts } = workoutsRoute.useLoaderData();
  const navigate = workoutsRoute.useNavigate();
  const search = workoutsRoute.useSearch();

  const list = bg.useLoadMore({
    key: search,
    first: workouts.data,
    load: async (cursor) => {
      const response = await fetch("/api/workouts/list", {
        method: "QUERY",
        credentials: "include",
        body: JSON.stringify({ filter: search.filter, section: search.section, cursor }),
      });

      if (!response.ok) return null;

      const page: WorkoutListResponse = await response.json();

      return page.data;
    },
  });

  bg.useShortcuts({
    [ShortcutDefinitions.OpenWorkout.trigger]: () => {
      if (list.entries[0]) {
        navigate({ params: { workoutId: list.entries[0].id }, search, to: "/workouts/$workoutId" });
      }
    },
  });

  if (workouts.count.total === 0) return null;

  return (
    <div data-stack="y" {...ui.Gap.block}>
      <WorkoutHistoryFilters />

      {list.entries.length === 0 && <WorkoutHistoryEmpty />}

      <ul aria-label={t("workout.list.header")} data-stack="y" {...ui.Gap.cluster}>
        {list.entries.map((workout) => (
          <ui.WorkoutCard key={workout.id} {...workout} />
        ))}
      </ul>

      {list.next !== null && (
        <div data-main="center" data-stack="x">
          <ui.TextLink disabled={list.state === bg.LoadMoreState.loading} onClick={list.more}>
            {t("workout.list.more")}
          </ui.TextLink>
        </div>
      )}

      {list.state === bg.LoadMoreState.error && (
        <output aria-live="assertive" data-color="danger-400" data-fs="xs" data-self="center">
          {t("workout.list.more.error")}
        </output>
      )}
    </div>
  );
}
