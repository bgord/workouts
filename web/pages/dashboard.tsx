// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import { CalendarOff } from "lucide-react";
import { Form as WorkoutHistoryFilters } from "../../app/services/workout-history-filters-form";
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateLink,
  EmptyStateMessage,
  Eyebrow,
  EyebrowLink,
  Header,
  Main,
  Meta,
  WorkoutCard,
} from "../components";
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
    <Main>
      <Header>{t("dashboard.header")}</Header>

      {empty && (
        <EmptyState>
          <EmptyStateIcon icon={CalendarOff} />

          <EmptyStateMessage>{t("dashboard.empty")}</EmptyStateMessage>

          <Meta>{t("dashboard.empty.hint")}</Meta>

          <EmptyStateLink search={WorkoutHistoryFilters.default} to="/workouts">
            {t("dashboard.empty.cta")}
          </EmptyStateLink>
        </EmptyState>
      )}

      <div data-gap="3" data-md-gap="6" data-md-stack="y" data-stack="x">
        {upcoming && (
          <div data-gap="2" data-grow="1" data-stack="y" style={tile}>
            <Eyebrow>
              {t(dashboard.inProgress ? "dashboard.in_progress.header" : "dashboard.next_up.header")}
            </Eyebrow>

            <ul data-gap="2" data-stack="y">
              <WorkoutCard {...upcoming} />
            </ul>
          </div>
        )}

        {dashboard.lastCompleted && (
          <div data-gap="2" data-grow="1" data-stack="y" style={tile}>
            <Eyebrow>{t("dashboard.last_completed.header")}</Eyebrow>

            <ul data-gap="2" data-stack="y">
              <WorkoutCard {...dashboard.lastCompleted} />
            </ul>
          </div>
        )}
      </div>

      <DashboardCompleted />

      {measurements.length > 0 && (
        <div data-gap="2" data-stack="y">
          <EyebrowLink to="/measurements">{t("measurements.body_weight.header")}</EyebrowLink>

          <BodyWeightStats measurements={measurements} />
        </div>
      )}
    </Main>
  );
}
