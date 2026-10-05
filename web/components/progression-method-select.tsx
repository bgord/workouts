import * as bg from "@bgord/ui";
import { ProgressionMethodOptions } from "../../modules/plans/value-objects/progression-method-options";
import { Gap } from "./gap";
import { Select } from "./select";

export function ProgressionMethodSelect(
  props: {
    field: bg.UseTextFieldReturnType<ProgressionMethodOptions>;
    options: ReadonlyArray<ProgressionMethodOptions> | undefined;
  } & Omit<React.JSX.IntrinsicElements["select"], "id" | "name" | "value" | "onChange">,
) {
  const { field, options = Object.values(ProgressionMethodOptions), ...rest } = props;
  const t = bg.useTranslations();

  return (
    <div data-stack="y" {...Gap.field}>
      <label {...field.label.props}>{t("progression.method.label")}</label>

      <Select {...rest} {...field.input.props}>
        {options.map((option) => (
          <option key={option} value={option}>
            {t(`progression.method.${option}`)}
          </option>
        ))}
      </Select>
    </div>
  );
}
