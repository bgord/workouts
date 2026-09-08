import * as bg from "@bgord/ui";
import * as WorkoutHistoryFiltersForm from "../../app/services/workout-history-filters-form";
import { WorkoutCard } from "../components";
import { homeRoute } from "../router";

export function WorkoutHistory() {
  const t = bg.useTranslations();
  const { workouts } = homeRoute.useLoaderData();
  const navigate = homeRoute.useNavigate();
  const search = homeRoute.useSearch();

  const matching = workouts.data.filter(
    (workout) => !search.section || workout.planSectionId === search.section,
  );

  if (workouts.data.length === 0) return <div data-color="neutral-400">{t("workout.list.empty")}</div>;

  return (
    <div data-gap="8" data-stack="y">
      <div data-cross="center" data-gap="3" data-stack="x">
        <ul data-gap="1" data-stack="x">
          {workouts.sections.map((section) => {
            const selected = search.section === section.id;

            return (
              <li key={section.id}>
                <button
                  aria-pressed={selected}
                  className="c-badge"
                  data-cursor="pointer"
                  data-variant={selected ? "primary" : "outline"}
                  onClick={() =>
                    navigate({ search: { section: selected ? undefined : section.id }, to: "/" })
                  }
                  type="button"
                >
                  {section.name}
                </button>
              </li>
            );
          })}
        </ul>

        <div data-color="neutral-400" data-fs="sm">
          {t("workout.list.count", { matching: matching.length, total: workouts.data.length })}
        </div>

        <button
          className="c-button"
          data-variant="ghost"
          disabled={WorkoutHistoryFiltersForm.Form.isDefault(search)}
          onClick={() => navigate({ search: WorkoutHistoryFiltersForm.Form.default, to: "/" })}
          type="button"
        >
          {t("app.clear")}
        </button>
      </div>

      {matching.length === 0 && <div data-color="neutral-400">{t("workout.list.no_matches")}</div>}

      <ul data-gap="3" data-stack="y">
        {matching.map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} />
        ))}
      </ul>
    </div>
  );
}
