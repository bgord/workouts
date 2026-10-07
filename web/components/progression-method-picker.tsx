import * as bg from "@bgord/ui";
import { useId } from "react";
import { ProgressionMethodOptions } from "../../modules/plans/value-objects/progression-method-options";
import { Gap } from "./gap";
import { ProgressionMethodIcon } from "./progression-method-icon";
import { RadioTile } from "./radio-tile";

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

      <ul data-stack="y" {...Gap.inline}>
        {options.map((option) => (
          <li key={option}>
            <RadioTile selected={option === props.field.value}>
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
                <div
                  data-color="neutral-100"
                  data-fw="medium"
                  data-stack="x"
                  id={`${id}-${option}`}
                  {...Gap.inline}
                >
                  <ProgressionMethodIcon method={option} size="xs" />
                  {t(`progression.method.${option}`)}
                </div>

                <small id={`${id}-${option}-hint`}>{t(`progression.method.${option}.hint`)}</small>
              </div>
            </RadioTile>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}
