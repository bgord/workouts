import * as bg from "@bgord/ui";
import type { ExerciseLoadStepOptions } from "../../modules/exercises/value-objects/exercise-load-step-options";
import { Gap } from "./gap";

export function ExerciseLoadStepPicker(props: {
  field: bg.UseTextFieldReturnType<ExerciseLoadStepOptions>;
  options: ReadonlyArray<ExerciseLoadStepOptions>;
  value: ExerciseLoadStepOptions;
  disabled?: boolean;
  actions?: React.ReactNode;
}) {
  const t = bg.useTranslations();

  if (props.options.length < 2) return null;

  return (
    <fieldset disabled={props.disabled}>
      <legend>{t("exercise.load_step.label")}</legend>

      <div data-cross="start" data-stack="x" {...Gap.cluster}>
        <div data-grow="1" data-minw="0" data-stack="x" data-wrap="wrap" {...Gap.cluster}>
          {props.options.map((option) => (
            <label
              className="c-badge"
              data-cursor="pointer"
              data-focus-within="ring"
              data-variant={option === props.value ? "primary" : "outline"}
              key={option}
            >
              <input
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

        {props.actions && <div data-shrink="0">{props.actions}</div>}
      </div>
    </fieldset>
  );
}
