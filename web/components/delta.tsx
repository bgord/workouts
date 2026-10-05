import * as bg from "@bgord/ui";
import { Triangle } from "lucide-react";
import { Gap } from "./gap";

type DeltaColor = React.JSX.IntrinsicElements["span"]["data-color"];

export function Delta(
  props: {
    current: number;
    previous: number | undefined;
    format: (difference: number) => React.ReactNode;
    tone?: (positive: boolean) => DeltaColor;
  } & React.JSX.IntrinsicElements["span"],
) {
  const t = bg.useTranslations();
  const { previous, current, format, tone, ...rest } = props;

  if (previous === undefined) return null;

  const difference = current - previous;

  if (difference === 0) return null;

  const positive = difference > 0;

  return (
    <span
      data-color={tone?.(positive) ?? (positive ? "positive-400" : "danger-400")}
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

      {format(Math.abs(difference))}
    </span>
  );
}
