import * as bg from "@bgord/ui";
import type { WorkoutListPlanSection } from "../../modules/workouts/queries/list-workouts";
import * as ui from "../components";

export function WorkoutSectionPicker(props: {
  sections: ReadonlyArray<WorkoutListPlanSection>;
  field: bg.UseTextFieldReturnType<WorkoutListPlanSection["id"] | "">;
}) {
  const t = bg.useTranslations();

  return (
    <div data-stack="y" {...ui.Gap.field}>
      <div className="c-label">{t("workout.create.section.label")}</div>

      <ul data-stack="y" {...ui.Gap.cluster}>
        {props.sections.map((option) => {
          const selected = option.id === props.field.value;

          return (
            <li key={option.id}>
              <ui.RadioTile selected={selected}>
                <input
                  checked={selected}
                  className="c-visually-hidden"
                  name={props.field.input.props.name}
                  onChange={props.field.input.props.onChange}
                  type="radio"
                  value={option.id}
                />

                <div data-grow="1" data-stack="y" data-transform="truncate" {...ui.Gap.inline}>
                  <div data-color="neutral-100" data-fs="sm" data-fw="medium">
                    {option.name}
                  </div>

                  <small data-transform="truncate">
                    {option.exerciseInstructions.map((instruction) => instruction.exercise.name).join(" · ")}
                  </small>
                </div>

                <small data-shrink="0">
                  {t("workout.create.section.exercises", { count: option.exerciseInstructions.length })}
                </small>
              </ui.RadioTile>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
