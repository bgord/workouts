// fallow-ignore-file unused-export
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

  const filter = bg.useTextField<WorkoutListFilterOptions>({
    name: WorkoutHistoryFiltersForm.Form.filter.field.name,
    defaultValue: search.filter ?? WorkoutListFilterOptions.last_week,
  });

  return (
    <div
      data-cross="center"
      data-stack="x"
      data-wrap="wrap"
      {...bg.Rhythm(36).times(1).style.minHeight}
      {...ui.Gap.cluster}
    >
      <ui.Select
        aria-label={t("workout.list.filter.label")}
        id={WorkoutHistoryFiltersForm.Form.filter.field.name}
        name={WorkoutHistoryFiltersForm.Form.filter.field.name}
        onChange={(event) => {
          filter.handleChange(event);
          navigate({
            search: {
              section: search.section,
              filter:
                event.currentTarget.value === WorkoutListFilterOptions.last_week
                  ? undefined
                  : (event.currentTarget.value as WorkoutListFilterOptions),
            },
            to: "/workouts",
          });
        }}
        value={filter.value}
      >
        {Object.values(WorkoutListFilterOptions).map((option) => (
          <option key={option} value={option}>
            {t(`workout.list.filter.${option}`)}
          </option>
        ))}
      </ui.Select>

      <ul
        data-cross="center"
        data-stack="x"
        data-wrap="wrap"
        {...bg.Rhythm(36).times(1).style.height}
        {...ui.Gap.cluster}
      >
        {workouts.sections.map((section) => (
          <li key={section.id}>
            <ui.ChipButton
              onClick={() =>
                navigate({
                  search: {
                    section: search.section === section.id ? undefined : section.id,
                    filter: undefined,
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

      <ui.Meta>
        {t("workout.list.count", { matching: props.matching.length, total: workouts.data.length })}
      </ui.Meta>

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
  );
}
