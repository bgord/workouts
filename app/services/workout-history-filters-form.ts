import { WorkoutListFilterOptions } from "../../modules/workouts/value-objects/workout-list-filter-options";

export const Form = {
  section: { field: { name: "section" } },
  filter: { field: { name: "filter" } },
  default: { section: undefined, filter: undefined },
  isDefault: (search: { section?: string; filter?: WorkoutListFilterOptions }): boolean =>
    search.section === Form.default.section && search.filter === Form.default.filter,
  validate: (
    value: Record<string, unknown>,
  ): { section: string | undefined; filter: WorkoutListFilterOptions | undefined } => ({
    section:
      typeof value["section"] === "string" && value["section"] !== ""
        ? value["section"]
        : Form.default.section,
    filter: Object.values(WorkoutListFilterOptions).includes(value["filter"] as WorkoutListFilterOptions)
      ? (value["filter"] as WorkoutListFilterOptions)
      : Form.default.filter,
  }),
};
