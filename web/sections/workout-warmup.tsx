import * as bg from "@bgord/ui";
import { ChevronDown, ChevronUp, Flame } from "lucide-react";
import * as ui from "../components";
import { workoutRoute } from "../router";

export function WorkoutWarmup() {
  const t = bg.useTranslations();
  const { workout } = workoutRoute.useLoaderData();

  const workoutWarmupExpanded = bg.usePersistedToggle({ name: `workout-warmup-expanded-${workout.data.id}` });

  if (!workout.data.planSectionWarmup) return null;

  return (
    <div
      data-bc="alpha-soft"
      data-br="md"
      data-bs="dashed"
      data-bw="hairline"
      data-stack="y"
      {...ui.Gap.block}
    >
      <button
        aria-label={t("workout.warmup.toggle")}
        data-bc="alpha-medium"
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
        <div data-stack="x" {...ui.Gap.block}>
          <Flame data-color="neutral-600" data-shrink="0" data-size="sm" />

          <h3 data-grow="1">{t("workout.warmup.label")}</h3>

          {workoutWarmupExpanded.on && <ChevronUp data-color="neutral-500" data-shrink="0" data-size="sm" />}

          {workoutWarmupExpanded.off && (
            <ChevronDown data-color="neutral-500" data-shrink="0" data-size="sm" />
          )}
        </div>

        {workoutWarmupExpanded.on && (
          <span className="c-prose" data-pl="8">
            {workout.data.planSectionWarmup}
          </span>
        )}
      </button>
    </div>
  );
}
