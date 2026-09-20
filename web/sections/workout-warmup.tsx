import * as bg from "@bgord/ui";
import { ChevronDown, ChevronUp, Flame } from "lucide-react";
import * as ui from "../components";
import { usePersistedToggle } from "../hooks/use-persisted-toggle";
import { workoutRoute } from "../router";

export function WorkoutWarmup() {
  const t = bg.useTranslations();
  const { workout } = workoutRoute.useLoaderData();

  const workoutWarmupExpanded = usePersistedToggle({ name: `workout-warmup-expanded-${workout.data.id}` });

  if (!workout.data.planSectionWarmup) return null;

  return (
    <div
      data-bc="neutral-850"
      data-br="md"
      data-bs="dashed"
      data-bw="hairline"
      data-stack="y"
      {...ui.Gap.block}
    >
      <button
        aria-label={t("workout.warmup.toggle")}
        data-bc="neutral-800"
        data-br="md"
        data-bw="hairline"
        data-cursor="pointer"
        data-p="3"
        data-stack="y"
        data-ta="start"
        onClick={workoutWarmupExpanded.toggle}
        title={t("workout.warmup.toggle")}
        type="button"
        {...ui.Gap.cluster}
        {...workoutWarmupExpanded.props.controller}
      >
        <div data-cross="center" data-stack="x" data-wrap="nowrap" {...ui.Gap.block}>
          <Flame data-color="neutral-600" data-shrink="0" data-size="sm" />

          <ui.Eyebrow data-grow="1">{t("workout.warmup.label")}</ui.Eyebrow>

          {workoutWarmupExpanded.on && <ChevronUp data-color="neutral-500" data-shrink="0" data-size="sm" />}

          {workoutWarmupExpanded.off && (
            <ChevronDown data-color="neutral-500" data-shrink="0" data-size="sm" />
          )}
        </div>

        {workoutWarmupExpanded.on && (
          <span className="c-prose" data-color="neutral-200" data-fs="sm" data-pl="8" data-ws="pre-line">
            {workout.data.planSectionWarmup}
          </span>
        )}
      </button>
    </div>
  );
}
