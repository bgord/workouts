import * as bg from "@bgord/ui";
import { Check } from "lucide-react";
import { RirColor } from "./rir-color";

const RirOptions = [2, 1, 0];

const segment = bg.Rhythm(34).times(1).height;

export function RirSubmit(props: {
  onSelect: (rir: number | undefined) => void;
  value?: number;
  disabled?: boolean;
  variant?: "default" | "dense";
}) {
  const t = bg.useTranslations();

  const options = [undefined, ...RirOptions];

  return (
    <div
      data-bc="alpha-soft"
      data-br="sm"
      data-bs="solid"
      data-bw="hairline"
      data-overflow="hidden"
      data-rir={props.variant ?? "default"}
      data-shrink="0"
      data-stack="x"
      data-wrap="nowrap"
      title={t("workout.set.rir.title")}
    >
      {options.map((option, index) => (
        <button
          aria-label={option === undefined ? t("workout.set.cta") : `${t("workout.set.cta")} · RIR ${option}`}
          data-bcl={index === 0 ? undefined : "alpha-soft"}
          data-bg={option !== undefined && option === props.value ? "neutral-900" : undefined}
          data-bsl={index === 0 ? undefined : "solid"}
          data-bwl={index === 0 ? undefined : "hairline"}
          data-color={option === undefined ? "positive-400" : RirColor(option)}
          data-cross="center"
          data-cursor="pointer"
          data-disp="flex"
          data-fs="xs"
          data-fw="medium"
          data-hover-bg="alpha-subtle"
          data-main="center"
          data-transform="font-variant-numeric"
          disabled={props.disabled}
          key={String(option)}
          onClick={() => props.onSelect(option)}
          style={segment}
          type="submit"
        >
          {option === undefined ? <Check data-size="sm" /> : option}
        </button>
      ))}
    </div>
  );
}
