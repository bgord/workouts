import * as bg from "@bgord/ui";
import type { ExerciseLoadingOptions } from "../../modules/exercises/value-objects/exercise-loading-options";
import { ProgressionMethodApplicability } from "../../modules/plans/value-objects/progression-method-applicability";
import { ProgressionMethodOptions } from "../../modules/plans/value-objects/progression-method-options";
import { Gap } from "./gap";
import { Select } from "./select";

export function ProgressionMethodSelect(
  props: {
    field: bg.UseTextFieldReturnType<ProgressionMethodOptions>;
    loading: ExerciseLoadingOptions | undefined;
  } & Omit<React.JSX.IntrinsicElements["select"], "id" | "name" | "value" | "onChange">,
) {
  const { field, loading, ...rest } = props;
  const t = bg.useTranslations();

  const options = loading ? ProgressionMethodApplicability[loading] : Object.values(ProgressionMethodOptions);

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
