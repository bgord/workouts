import * as bg from "@bgord/ui";
import { ChipButton } from "./chip";
import { Gap } from "./gap";
import { RirOptions } from "./rir-options";

export function RirTargetPicker(props: { field: bg.UseNumberFieldReturnType<number>; disabled?: boolean }) {
  const t = bg.useTranslations();

  const options = [undefined, ...RirOptions];

  return (
    <fieldset disabled={props.disabled}>
      <legend>{t("rir.target.label")}</legend>

      <div data-stack="y" {...Gap.inline}>
        <div data-stack="x" data-wrap="wrap" {...Gap.cluster}>
          {options.map((option) => (
            <ChipButton
              data-transform="font-variant-numeric"
              key={String(option)}
              onClick={() => props.field.set(option)}
              pressed={option === props.field.value}
            >
              {option === undefined ? t("rir.target.none") : `${t("workout.set.rir.label")} ${option}`}
            </ChipButton>
          ))}
        </div>

        <small>{t("rir.target.hint")}</small>
      </div>
    </fieldset>
  );
}
