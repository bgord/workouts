import * as bg from "@bgord/ui";
import { Form as WorkoutHistoryFilters } from "../../app/services/workout-history-filters-form";
import * as ui from "../components";
import { dashboardRoute } from "../router";
import * as ShortcutDefinitions from "../services/shortcuts";

export function DashboardWorkoutsFastCall() {
  const t = bg.useTranslations();
  const { dashboard } = dashboardRoute.useLoaderData();
  const navigate = dashboardRoute.useNavigate();

  const upcoming = dashboard.inProgress ?? dashboard.nextUp;

  bg.useShortcuts({
    [ShortcutDefinitions.OpenUpcomingWorkout.trigger]: () => {
      if (upcoming) {
        navigate({
          params: { workoutId: upcoming.id },
          search: WorkoutHistoryFilters.default,
          to: "/workouts/$workoutId",
        });
      }
    },
  });

  return (
    <div data-cross="stretch" data-md-stack="y" data-stack="x" data-wrap="wrap" {...ui.Gap.related}>
      {upcoming && (
        <div data-basis="0" data-grow="1" data-minw="0" data-stack="y" {...ui.Gap.cluster}>
          <ui.Eyebrow>
            {t(dashboard.inProgress ? "dashboard.in_progress.header" : "dashboard.next_up.header")}
          </ui.Eyebrow>

          <ul>
            <ui.WorkoutCard {...upcoming} />
          </ul>
        </div>
      )}

      {dashboard.lastCompleted && (
        <div data-basis="0" data-grow="1" data-minw="0" data-stack="y" {...ui.Gap.cluster}>
          <ui.Eyebrow>{t("dashboard.last_completed.header")}</ui.Eyebrow>

          <ul>
            <ui.WorkoutCard {...dashboard.lastCompleted} />
          </ul>
        </div>
      )}
    </div>
  );
}
