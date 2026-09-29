import * as bg from "@bgord/ui";
import { Triangle } from "lucide-react";
import { LengthFormat } from "../services/length-format";
import { Gap } from "./gap";

export function LengthDelta(props: { millimeters: number | null } & React.JSX.IntrinsicElements["span"]) {
  const t = bg.useTranslations();
  const { millimeters, ...rest } = props;

  if (millimeters === null || millimeters === 0) return null;

  const positive = millimeters > 0;

  return (
    <span
      data-color={positive ? "positive-400" : "danger-400"}
      data-stack="x"
      data-transform="nowrap"
      {...Gap.inline}
      {...rest}
    >
      <Triangle
        data-mt={positive ? "0" : "0-5"}
        data-rotate={positive ? "0" : "180"}
        fill="currentColor"
        size={9}
        strokeWidth={0}
      />

      {t("measurements.body_parts.value", {
        value: LengthFormat.centimeters(Math.abs(millimeters)).toFixed(1),
      })}
    </span>
  );
}
