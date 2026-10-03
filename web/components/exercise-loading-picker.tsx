import * as bg from "@bgord/ui";
import { ExerciseLoadingOptions } from "../../modules/exercises/value-objects/exercise-loading-options";
import { Gap } from "./gap";
import { RadioTile } from "./radio-tile";

export function ExerciseLoadingPicker(props: {
  field: bg.UseTextFieldReturnType<ExerciseLoadingOptions>;
  disabled?: boolean;
}) {
  const t = bg.useTranslations();

  return (
    <fieldset disabled={props.disabled}>
      <legend>{t("exercise.loading.label")}</legend>

      <ul data-stack="x" data-wrap="wrap" {...Gap.cluster}>
        {Object.values(ExerciseLoadingOptions).map((option) => {
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
                    {t(`exercise.loading.${option}`)}
                  </div>

                  <small>{t(`exercise.loading.${option}.hint`)}</small>
                </div>
              </RadioTile>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
