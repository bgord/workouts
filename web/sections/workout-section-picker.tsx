import * as bg from "@bgord/ui";
import type { PlanSection } from "../../modules/plans/queries/get-plan";
import * as ui from "../components";

export function WorkoutSectionPicker(props: {
  sections: Array<PlanSection>;
  field: bg.UseTextFieldReturnType<PlanSection["id"] | "">;
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

                  <ui.Meta truncate>
                    {option.exerciseInstructions.map((instruction) => instruction.exercise.name).join(" · ")}
                  </ui.Meta>
                </div>

                <ui.Meta data-shrink="0">
                  {t("workout.create.section.exercises", { count: option.exerciseInstructions.length })}
                </ui.Meta>
              </ui.RadioTile>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
