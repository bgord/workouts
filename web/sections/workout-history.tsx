import * as bg from "@bgord/ui";
import * as WorkoutHistoryFiltersForm from "../../app/services/workout-history-filters-form";
import type { PlanSectionIdType } from "../../modules/plans/value-objects/plan-section-id";
import type { PlanSectionNameType } from "../../modules/plans/value-objects/plan-section-name";
import { WorkoutCard } from "../components";
import { homeRoute } from "../router";

export function WorkoutHistory() {
  const t = bg.useTranslations();
  const { plan, workouts } = homeRoute.useLoaderData();
  const navigate = homeRoute.useNavigate();
  const search = homeRoute.useSearch();

  const sections = workouts.reduce<Array<{ id: PlanSectionIdType; name: PlanSectionNameType }>>(
    (result, workout) => {
      if (result.some((section) => section.id === workout.planSectionId)) return result;

      const current = plan?.sections.find((section) => section.id === workout.planSectionId);

      return [...result, { id: workout.planSectionId, name: current?.name ?? workout.planSectionName }];
    },
    [],
  );

  const matching = workouts.filter((workout) => !search.section || workout.planSectionId === search.section);

  if (workouts.length === 0) return <div data-color="neutral-400">{t("workout.list.empty")}</div>;

  return (
    <div data-gap="8" data-stack="y">
      <div data-cross="center" data-gap="3" data-stack="x">
        <ul data-gap="1" data-stack="x">
          {sections.map((section) => {
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
          {t("workout.list.count", { matching: matching.length, total: workouts.length })}
        </div>

        {!WorkoutHistoryFiltersForm.Form.isDefault(search) && (
          <button
            className="c-button"
            data-variant="ghost"
            onClick={() => navigate({ search: WorkoutHistoryFiltersForm.Form.default, to: "/" })}
            type="button"
          >
            {t("app.clear")}
          </button>
        )}
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
