import * as bg from "@bgord/ui";
import * as WorkoutHistoryFiltersForm from "../../app/services/workout-history-filters-form";
import { WorkoutCard } from "../components";
import { workoutsRoute } from "../router";

export function WorkoutHistory() {
  const t = bg.useTranslations();
  const { workouts } = workoutsRoute.useLoaderData();
  const navigate = workoutsRoute.useNavigate();
  const search = workoutsRoute.useSearch();

  const matching = workouts.data.filter(
    (workout) => !search.section || workout.planSectionId === search.section,
  );

  if (workouts.data.length === 0) return <div data-color="neutral-400">{t("workout.list.empty")}</div>;

  return (
    <div data-gap="8" data-stack="y">
      <div data-cross="baseline" data-gap="3" data-stack="x">
        <ul data-gap="1" data-stack="x">
          {workouts.sections.map((section) => (
            <li key={section.id}>
              <button
                aria-pressed={search.section === section.id}
                className="c-badge"
                data-cursor="pointer"
                data-variant={search.section === section.id ? "primary" : "outline"}
                onClick={() =>
                  navigate({
                    search: { section: search.section === section.id ? undefined : section.id },
                    to: "/workouts",
                  })
                }
                type="button"
              >
                {section.name}
              </button>
            </li>
          ))}
        </ul>

        <div data-color="neutral-400" data-fs="sm">
          {t("workout.list.count", { matching: matching.length, total: workouts.data.length })}
        </div>

        <button
          className="c-button"
          data-variant="ghost"
          disabled={cleared}
          onClick={() => navigate({ search: WorkoutHistoryFiltersForm.Form.default, to: "/workouts" })}
          type="button"
        >
          {t("app.clear")}
        </button>
      </div>

      {matching.length === 0 && <div data-color="neutral-400">{t("workout.list.no_matches")}</div>}

      <ul data-gap="3" data-stack="y">
        {matching.map((workout) => (
          <WorkoutCard key={workout.id} {...workout} />
        ))}
      </ul>
    </div>
  );
}
