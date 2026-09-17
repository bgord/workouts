// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { CalendarOff } from "lucide-react";
import { Form as WorkoutHistoryFilters } from "../../app/services/workout-history-filters-form";
import { Eyebrow, EyebrowLink, Header, Main, Meta, WorkoutCard } from "../components";
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
        <div
          className="c-card"
          data-cross="center"
          data-gap="1"
          data-py="8"
          data-stack="y"
          data-variant="flat"
        >
          <CalendarOff data-color="neutral-600" data-size="md" />

          <div data-color="neutral-300" data-fs="sm" data-mt="2">
            {t("dashboard.empty")}
          </div>

          <Meta>{t("dashboard.empty.hint")}</Meta>

          <Link
            className="c-link"
            data-fs="sm"
            data-mt="2"
            search={WorkoutHistoryFilters.default}
            to="/workouts"
          >
            {t("dashboard.empty.cta")}
          </Link>
        </div>
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
