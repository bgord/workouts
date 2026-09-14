import type { WorkoutListFilterOptions } from "../../modules/workouts/value-objects/workout-list-filter-options";

export const Form = {
  section: { field: { name: "section" } },
  filter: { field: { name: "filter" } },
  default: { section: undefined, filter: undefined },
  isDefault: (search: { section?: string; filter?: WorkoutListFilterOptions }): boolean =>
    search.section === Form.default.section && search.filter === Form.default.filter,
};
