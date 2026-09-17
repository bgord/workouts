// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import { CalendarOff } from "lucide-react";
import { Form as WorkoutHistoryFilters } from "../../app/services/workout-history-filters-form";
import * as ui from "../components";
import { dashboardRoute } from "../router";
import { BodyWeightStats } from "../sections/body-weight-stats";
import { DashboardCompleted } from "../sections/dashboard-completed";
import * as ShortcutDefinitions from "../services/shortcuts";

const tile = { flexBasis: 0, minWidth: 0 };

export function Dashboard() {
  const t = bg.useTranslations();
  const { dashboard, measurements } = dashboardRoute.useLoaderData();
  const navigate = dashboardRoute.useNavigate();

  const upcoming = dashboard.inProgress ?? dashboard.nextUp;
  const empty = !(upcoming || dashboard.lastCompleted);

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
    <ui.Main>
      <ui.Header>{t("dashboard.header")}</ui.Header>

      {empty && (
        <ui.EmptyState>
          <ui.EmptyStateIcon icon={CalendarOff} />

          <ui.EmptyStateMessage>{t("dashboard.empty")}</ui.EmptyStateMessage>

          <ui.Meta>{t("dashboard.empty.hint")}</ui.Meta>

          <ui.EmptyStateLink search={WorkoutHistoryFilters.default} to="/workouts">
            {t("dashboard.empty.cta")}
          </ui.EmptyStateLink>
        </ui.EmptyState>
      )}

      <div data-md-stack="y" data-stack="x" {...ui.Spacing.columns}>
        {upcoming && (
          <div data-grow="1" data-stack="y" style={tile} {...ui.Spacing.cluster}>
            <ui.Eyebrow>
              {t(dashboard.inProgress ? "dashboard.in_progress.header" : "dashboard.next_up.header")}
            </ui.Eyebrow>

            <ul>
              <ui.WorkoutCard {...upcoming} />
            </ul>
          </div>
        )}

        {dashboard.lastCompleted && (
          <div data-grow="1" data-stack="y" style={tile} {...ui.Spacing.cluster}>
            <ui.Eyebrow>{t("dashboard.last_completed.header")}</ui.Eyebrow>

            <ul>
              <ui.WorkoutCard {...dashboard.lastCompleted} />
            </ul>
          </div>
        )}
      </div>

      <DashboardCompleted />

      {measurements.length > 0 && (
        <div data-stack="y" {...ui.Spacing.cluster}>
          <ui.EyebrowLink to="/measurements">{t("measurements.body_weight.header")}</ui.EyebrowLink>

          <BodyWeightStats measurements={measurements} />
        </div>
      )}
    </ui.Main>
  );
}
