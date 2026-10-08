import * as bg from "@bgord/ui";
import { useId } from "react";
import type { ExerciseLoadStepOptions } from "../../modules/exercises/value-objects/exercise-load-step-options";
import { Gap } from "./gap";

export function ExerciseLoadStepPicker(props: {
  field: bg.UseTextFieldReturnType<ExerciseLoadStepOptions>;
  options: ReadonlyArray<ExerciseLoadStepOptions>;
  value: ExerciseLoadStepOptions;
  disabled?: boolean;
}) {
  const t = bg.useTranslations();
  const id = useId();

  if (props.options.length < 2) return null;

  return (
    <fieldset disabled={props.disabled}>
      <legend>{t("exercise.load_step.label")}</legend>

      <div data-stack="y" {...Gap.inline}>
        <div data-stack="x" data-wrap="wrap" {...Gap.cluster}>
          {props.options.map((option) => (
            <label
              className="c-badge"
              data-cursor="pointer"
              data-variant={option === props.value ? "primary" : "outline"}
              key={option}
            >
              <input
                aria-describedby={`${id}-${option}-hint`}
                checked={option === props.value}
                className="c-visually-hidden"
                name={props.field.input.props.name}
                onChange={props.field.input.props.onChange}
                type="radio"
                value={option}
              />
              {t(`exercise.load_step.${option}`)}
            </label>
          ))}
        </div>

        {props.options.map((option) => (
          <small hidden={option !== props.value} id={`${id}-${option}-hint`} key={option}>
            {t(`exercise.load_step.${option}.hint`)}
          </small>
        ))}
      </div>
    </fieldset>
  );
}
