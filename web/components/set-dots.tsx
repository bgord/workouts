import * as bg from "@bgord/ui";
import { Gap } from "./gap";
import { RirColor } from "./rir-color";

const dot = { width: 8, height: 8 };
const ring = (color: RirColor) => ({ ...dot, boxShadow: `inset 0 0 0 2px var(--color-${color})` });

export function SetDots(
  props: React.JSX.IntrinsicElements["span"] & { sets: Array<{ rir: number | null }>; target: number },
) {
  const t = bg.useTranslations();
  const { sets, target, ...span } = props;

  const dots = Array.from({ length: Math.max(sets.length, target) }, (_, index) => index);

  const color = (index: number): RirColor => {
    const rir = sets[index]?.rir;

    return rir === undefined || rir === null ? "positive-400" : RirColor(rir);
  };

  return (
    <span
      aria-label={t("workout.set.progress", { done: sets.length, target })}
      data-shrink="0"
      data-stack="x"
      role="img"
      {...Gap.inline}
      title={t("workout.set.progress", { done: sets.length, target })}
      {...span}
    >
      {dots.map((index) => (
        <span
          data-bg={index >= target ? undefined : index < sets.length ? color(index) : "neutral-700"}
          data-br="circle"
          key={index}
          style={index >= target ? ring(color(index)) : dot}
        />
      ))}
    </span>
  );
}
