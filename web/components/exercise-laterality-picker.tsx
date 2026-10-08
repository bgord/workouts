import * as bg from "@bgord/ui";
import { useId } from "react";
import { ExerciseLateralityOptions } from "../../modules/exercises/value-objects/exercise-laterality-options";
import { Gap } from "./gap";
import { RadioTile } from "./radio-tile";

export function ExerciseLateralityPicker(props: {
  field: bg.UseTextFieldReturnType<ExerciseLateralityOptions>;
  disabled?: boolean;
}) {
  const t = bg.useTranslations();
  const id = useId();

  return (
    <fieldset disabled={props.disabled}>
      <legend>{t("exercise.laterality.label")}</legend>

      <ul data-cross="stretch" data-stack="x" data-wrap="wrap" {...Gap.cluster}>
        {Object.values(ExerciseLateralityOptions).map((option) => (
          <li data-basis="0" data-grow="1" data-md-basis="unset" data-stack="y" key={option}>
            <RadioTile data-grow="1" selected={option === props.field.value}>
              <input
                aria-describedby={`${id}-${option}-hint`}
                aria-labelledby={`${id}-${option}`}
                checked={option === props.field.value}
                className="c-visually-hidden"
                name={props.field.input.props.name}
                onChange={props.field.input.props.onChange}
                type="radio"
                value={option}
              />

              <div data-stack="y" {...Gap.inline}>
                <div data-color="neutral-100" data-fw="medium" id={`${id}-${option}`}>
                  {t(`exercise.laterality.${option}`)}
                </div>

                <small id={`${id}-${option}-hint`}>{t(`exercise.laterality.${option}.hint`)}</small>
              </div>
            </RadioTile>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}
