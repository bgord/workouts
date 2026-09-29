import * as bg from "@bgord/ui";
import { Triangle } from "lucide-react";
import { LengthFormat } from "../services/length-format";

export function LengthDelta(props: { millimeters: number | null }) {
  const t = bg.useTranslations();

  if (props.millimeters === null) return null;

  if (props.millimeters === 0) {
    return <span data-delta-pill="same">{t("measurements.body_parts.delta.same")}</span>;
  }

  const grew = props.millimeters > 0;

  return (
    <span data-delta-pill={grew ? "up" : "down"} data-transform="font-variant-numeric">
      <Triangle data-rotate={grew ? "0" : "180"} fill="currentColor" size={8} strokeWidth={0} />
      {t("measurements.body_parts.value", {
        value: `${grew ? "+" : "−"}${LengthFormat.centimeters(Math.abs(props.millimeters)).toFixed(1)}`,
      })}
    </span>
  );
}
