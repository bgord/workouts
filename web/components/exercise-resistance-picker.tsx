import * as bg from "@bgord/ui";
import { ExerciseResistanceOptions } from "../../modules/exercises/value-objects/exercise-resistance-options";
import { Gap } from "./gap";
import { RadioTile } from "./radio-tile";

export function ExerciseResistancePicker(props: {
  field: bg.UseTextFieldReturnType<ExerciseResistanceOptions>;
  disabled?: boolean;
}) {
  const t = bg.useTranslations();

  return (
    <fieldset disabled={props.disabled}>
      <legend>{t("exercise.resistance.label")}</legend>

      <ul data-stack="x" data-wrap="wrap" {...Gap.cluster}>
        {Object.values(ExerciseResistanceOptions).map((option) => {
          const selected = option === props.field.value;

          return (
            <li data-grow="1" key={option}>
              <RadioTile selected={selected}>
                <input
                  checked={selected}
                  className="c-visually-hidden"
                  name={props.field.input.props.name}
                  onChange={props.field.input.props.onChange}
                  type="radio"
                  value={option}
                />

                <div data-stack="y" {...Gap.inline}>
                  <div data-color="neutral-100" data-fw="medium">
                    {t(`exercise.resistance.${option}`)}
                  </div>

                  <small>{t(`exercise.resistance.${option}.hint`)}</small>
                </div>
              </RadioTile>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
