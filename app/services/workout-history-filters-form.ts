import * as bg from "@bgord/ui";
import { WorkoutListFilterOptions } from "../../modules/workouts/value-objects/workout-list-filter-options";

export const Form = {
  section: { field: { name: "section" } },
  filter: { field: { name: "filter" } },
  ...bg.SearchParam.form({
    section: bg.SearchParam.text(),
    filter: bg.SearchParam.oneOf(Object.values(WorkoutListFilterOptions)),
  }),
};
