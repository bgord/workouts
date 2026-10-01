import * as bg from "@bgord/ui";
import { Triangle } from "lucide-react";
import { Gap } from "./gap";
import { LengthValue } from "./length-value";

export function LengthDelta(
  props: { current: number; previous: number | undefined } & React.JSX.IntrinsicElements["span"],
) {
  const t = bg.useTranslations();
  const { previous, current, ...rest } = props;

  if (previous === undefined) return null;

  const difference = current - previous;

  if (difference === 0) return null;

  const positive = difference > 0;

  return (
    <span
      data-color={positive ? "positive-400" : "danger-400"}
      data-stack="x"
      data-transform="nowrap"
      {...Gap.inline}
      {...rest}
    >
      <Triangle
        aria-label={t(positive ? "app.delta.increase" : "app.delta.decrease")}
        data-mt={positive ? "0" : "0-5"}
        data-rotate={positive ? "0" : "180"}
        fill="currentColor"
        role="img"
        size={9}
        strokeWidth={0}
      />

      <LengthValue millimeters={Math.abs(difference)} />
    </span>
  );
}
