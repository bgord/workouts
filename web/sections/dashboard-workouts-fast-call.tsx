// fallow-ignore-file unused-export
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
    <div data-md-stack="y" data-stack="x" {...ui.Gap.related}>
      {upcoming && (
        <div data-grow="1" data-stack="y" style={{ flexBasis: 0, minWidth: 0 }} {...ui.Gap.cluster}>
          <ui.Eyebrow>
            {t(dashboard.inProgress ? "dashboard.in_progress.header" : "dashboard.next_up.header")}
          </ui.Eyebrow>

          <ul>
            <ui.WorkoutCard {...upcoming} />
          </ul>
        </div>
      )}

      {dashboard.lastCompleted && (
        <div data-grow="1" data-stack="y" style={{ flexBasis: 0, minWidth: 0 }} {...ui.Gap.cluster}>
          <ui.Eyebrow>{t("dashboard.last_completed.header")}</ui.Eyebrow>

          <ul>
            <ui.WorkoutCard {...dashboard.lastCompleted} />
          </ul>
        </div>
      )}
    </div>
  );
}
