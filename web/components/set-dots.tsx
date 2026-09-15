import { useTranslations } from "@bgord/ui";

const dot = { width: 8, height: 8 };
const extra = { ...dot, boxShadow: "inset 0 0 0 2px var(--color-positive-400)" };

export function SetDots(props: { done: number; target: number }) {
  const t = useTranslations();

  const label = t("workout.set.progress", { done: props.done, target: props.target });
  const dots = Array.from({ length: Math.max(props.done, props.target) }, (_, index) => index);

  return (
    <div
      aria-label={label}
      data-cross="center"
      data-gap="1"
      data-shrink="0"
      data-stack="x"
      data-wrap="nowrap"
      role="img"
      title={label}
    >
      {dots.map((index) => (
        <span
          data-bg={index >= props.target ? undefined : index < props.done ? "positive-400" : "neutral-700"}
          data-br="circle"
          key={index}
          style={index >= props.target ? extra : dot}
        />
      ))}
    </div>
  );
}
