// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { CalendarOff } from "lucide-react";
import { Form as WorkoutHistoryFilters } from "../../app/services/workout-history-filters-form";
import { Main, WorkoutCard } from "../components";
import { dashboardRoute } from "../router";
import { DashboardCompleted } from "../sections/dashboard-completed";
import * as ShortcutDefinitions from "../services/shortcuts";

const tile = { flexBasis: 0, minWidth: 0 };

export function Dashboard() {
  const t = bg.useTranslations();
  const { dashboard } = dashboardRoute.useLoaderData();
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
      <h1 data-color="neutral-0" data-fs="2xl" data-fw="black" data-md-fs="xl">
        {t("dashboard.header")}
      </h1>

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

          <div data-color="neutral-500" data-fs="xs">
            {t("dashboard.empty.hint")}
          </div>

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

      <div data-gap="6" data-md-stack="y" data-stack="x">
        {upcoming && (
          <div data-gap="2" data-grow="1" data-stack="y" style={tile}>
            <div data-color="neutral-500" data-fs="xs" data-ls="wide" data-transform="uppercase">
              {t(dashboard.inProgress ? "dashboard.in_progress.header" : "dashboard.next_up.header")}
            </div>

            <ul data-gap="2" data-stack="y">
              <WorkoutCard {...upcoming} />
            </ul>
          </div>
        )}

        {dashboard.lastCompleted && (
          <div data-gap="2" data-grow="1" data-stack="y" style={tile}>
            <div data-color="neutral-500" data-fs="xs" data-ls="wide" data-transform="uppercase">
              {t("dashboard.last_completed.header")}
            </div>

            <ul data-gap="2" data-stack="y">
              <WorkoutCard {...dashboard.lastCompleted} />
            </ul>
          </div>
        )}
      </div>

      <DashboardCompleted />
    </Main>
  );
}
