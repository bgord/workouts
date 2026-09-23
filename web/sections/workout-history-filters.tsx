import * as bg from "@bgord/ui";
import { X } from "lucide-react";
import * as WorkoutHistoryFiltersForm from "../../app/services/workout-history-filters-form";
import { WorkoutListFilterOptions } from "../../modules/workouts/value-objects/workout-list-filter-options";
import type { WorkoutSummary } from "../../modules/workouts/value-objects/workout-summary";
import * as ui from "../components";
import { workoutsRoute } from "../router";

export function WorkoutHistoryFilters(props: { matching: Array<WorkoutSummary> }) {
  const t = bg.useTranslations();
  const { workouts } = workoutsRoute.useLoaderData();
  const navigate = workoutsRoute.useNavigate();
  const search = workoutsRoute.useSearch();

  return (
    <div data-stack="x" data-wrap="wrap" {...bg.Rhythm(36).times(1).style.minHeight} {...ui.Gap.cluster}>
      <ui.Select
        aria-label={t("workout.list.filter.label")}
        id={WorkoutHistoryFiltersForm.Form.filter.field.name}
        name={WorkoutHistoryFiltersForm.Form.filter.field.name}
        onChange={(event) => {
          const filter = event.currentTarget.value as WorkoutListFilterOptions;

          navigate({
            search: {
              section: search.section,
              filter: filter === WorkoutListFilterOptions.last_week ? undefined : filter,
            },
            to: "/workouts",
          });
        }}
        value={search.filter ?? WorkoutListFilterOptions.last_week}
      >
        {Object.values(WorkoutListFilterOptions).map((option) => (
          <option key={option} value={option}>
            {t(`workout.list.filter.${option}`)}
          </option>
        ))}
      </ui.Select>

      <div data-stack="x" data-wrap="wrap" {...bg.Rhythm(36).times(1).style.minHeight} {...ui.Gap.cluster}>
        <ul data-stack="x" data-wrap="wrap" {...ui.Gap.cluster}>
          {workouts.sections.map((section) => (
            <li key={section.id}>
              <ui.ChipButton
                onClick={() =>
                  navigate({
                    search: {
                      section: search.section === section.id ? undefined : section.id,
                      filter: search.filter,
                    },
                    to: "/workouts",
                  })
                }
                pressed={search.section === section.id}
              >
                {section.name}
              </ui.ChipButton>
            </li>
          ))}
        </ul>

        <small>
          {t("workout.list.count", { matching: props.matching.length, total: workouts.data.length })}
        </small>

        {!WorkoutHistoryFiltersForm.Form.isDefault(search) && (
          <ui.IconButton
            aria-label={t("app.clear")}
            onClick={() => navigate({ search: WorkoutHistoryFiltersForm.Form.default, to: "/workouts" })}
            title={t("app.clear")}
          >
            <X data-size="sm" />
          </ui.IconButton>
        )}
      </div>
    </div>
  );
}
