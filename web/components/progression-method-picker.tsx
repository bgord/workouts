import * as bg from "@bgord/ui";
import { useId } from "react";
import { ProgressionMethodOptions } from "../../modules/plans/value-objects/progression-method-options";
import { Gap } from "./gap";
import { ProgressionMethodIcon } from "./progression-method-icon";

export function ProgressionMethodPicker(props: {
  field: bg.UseTextFieldReturnType<ProgressionMethodOptions>;
  options: ReadonlyArray<ProgressionMethodOptions> | undefined;
  disabled?: boolean;
}) {
  const t = bg.useTranslations();
  const id = useId();
  const { options = Object.values(ProgressionMethodOptions) } = props;

  return (
    <fieldset disabled={props.disabled}>
      <legend>{t("progression.method.label")}</legend>

      <div data-stack="y" {...Gap.inline}>
        <div data-stack="x" data-wrap="wrap" {...Gap.cluster}>
          {options.map((option) => (
            <label
              className="c-badge"
              data-cursor="pointer"
              data-stack="x"
              data-variant={option === props.field.value ? "primary" : "outline"}
              key={option}
              {...Gap.inline}
            >
              <input
                aria-describedby={`${id}-${option}-hint`}
                checked={option === props.field.value}
                className="c-visually-hidden"
                name={props.field.input.props.name}
                onChange={props.field.input.props.onChange}
                type="radio"
                value={option}
              />
              <ProgressionMethodIcon method={option} size="xs" />
              {t(`progression.method.${option}`)}
            </label>
          ))}
        </div>

        {options.map((option) => (
          <small hidden={option !== props.field.value} id={`${id}-${option}-hint`} key={option}>
            {t(`progression.method.${option}.hint`)}
          </small>
        ))}
      </div>
    </fieldset>
  );
}
