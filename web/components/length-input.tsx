import * as bg from "@bgord/ui";

export function LengthInput(props: React.JSX.IntrinsicElements["input"]) {
  const t = bg.useTranslations();

  return (
    <>
      <input
        className="c-input"
        data-shrink="0"
        data-spin="none"
        data-transform="font-variant-numeric"
        inputMode="decimal"
        min={0.1}
        step={0.1}
        style={{ ...bg.Rhythm(34).times(1).height, ...bg.Rhythm(88).times(1).width, textAlign: "right" }}
        type="number"
        {...props}
      />

      <small data-color="neutral-500">{t("measurements.body_parts.measure.unit")}</small>
    </>
  );
}
