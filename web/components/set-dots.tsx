import * as bg from "@bgord/ui";
import { Gap } from "./gap";
import { RirColor } from "./rir-color";

const dot = { width: 8, height: 8 };
const ring = (color: RirColor) => ({ ...dot, boxShadow: `inset 0 0 0 2px var(--color-${color})` });

export function SetDots(props: { sets: Array<{ rir?: number }>; target: number }) {
  const t = bg.useTranslations();

  const dots = Array.from({ length: Math.max(props.sets.length, props.target) }, (_, index) => index);

  const color = (index: number): RirColor => {
    const rir = props.sets[index]?.rir;

    return rir === undefined ? "positive-400" : RirColor(rir);
  };

  return (
    <div
      aria-label={t("workout.set.progress", { done: props.sets.length, target: props.target })}
      data-cross="center"
      data-shrink="0"
      data-stack="x"
      data-wrap="nowrap"
      role="img"
      {...Gap.inline}
      title={t("workout.set.progress", { done: props.sets.length, target: props.target })}
    >
      {dots.map((index) => (
        <span
          data-bg={
            index >= props.target ? undefined : index < props.sets.length ? color(index) : "neutral-700"
          }
          data-br="circle"
          key={index}
          style={index >= props.target ? ring(color(index)) : dot}
        />
      ))}
    </div>
  );
}
