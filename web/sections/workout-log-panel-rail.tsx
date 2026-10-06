import * as bg from "@bgord/ui";
import { useLayoutEffect, useRef } from "react";
import * as ui from "../components";
import { useLogPanel } from "../hooks/use-log-panel";
import { WorkoutLogPanelImage } from "./workout-log-panel-image";

export function WorkoutLogPanelRail() {
  const t = bg.useTranslations();
  const { active, available, open } = useLogPanel();
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const rail = ref.current;
    const current = rail?.querySelector<HTMLElement>("[aria-current]");

    if (!(rail && current)) return;

    rail.scrollLeft = current.offsetLeft - rail.offsetLeft - (rail.clientWidth - current.offsetWidth) / 2;
  }, [active?.id]);

  return (
    <div
      aria-label={t("workout.log_panel.exercises")}
      data-bct="alpha-subtle"
      data-bst="solid"
      data-bwt="hairline"
      data-pt="3"
      data-rail
      data-stack="x"
      ref={ref}
      role="group"
      {...ui.Gap.inline}
    >
      {available.map((exercise, index) => {
        const title = t("workout.log_panel.exercise.title", {
          position: index + 1,
          name: exercise.exerciseName,
        });
        const current = exercise.id === active?.id;

        return (
          <button
            aria-current={current ? "step" : undefined}
            aria-label={title}
            data-bc={current ? "brand-400" : undefined}
            data-br="md"
            data-bs="solid"
            data-bw="hairline"
            data-cross="center"
            data-cursor="pointer"
            data-gap="1-5"
            data-hover-bc={current ? undefined : "alpha-soft"}
            data-opacity={current || exercise.loggedSets.length > 0 ? undefined : "low"}
            data-p="1"
            data-shrink="0"
            data-stack="y"
            key={exercise.id}
            onClick={() => open(exercise.id)}
            style={
              current
                ? { backgroundColor: "color-mix(in oklch, var(--color-brand-400) 10%, transparent)" }
                : undefined
            }
            title={title}
            type="button"
          >
            <WorkoutLogPanelImage exercise={exercise} />

            <ui.SetDots sets={exercise.loggedSets} target={exercise.target?.sets ?? 0} />
          </button>
        );
      })}
    </div>
  );
}
