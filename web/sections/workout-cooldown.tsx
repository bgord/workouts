import * as bg from "@bgord/ui";
import { ChevronDown, ChevronUp, Snowflake } from "lucide-react";
import * as ui from "../components";
import { usePersistedToggle } from "../hooks/use-persisted-toggle";
import { workoutRoute } from "../router";

export function WorkoutCooldown() {
  const t = bg.useTranslations();
  const { workout } = workoutRoute.useLoaderData();

  const workoutCooldownExpanded = usePersistedToggle({
    name: `workout-cooldown-expanded-${workout.data.id}`,
  });

  if (!workout.data.planSectionCooldown) return null;

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
        aria-label={t("workout.cooldown.toggle")}
        data-bc="neutral-800"
        data-br="md"
        data-bw="hairline"
        data-cursor="pointer"
        data-p="3"
        data-stack="y"
        data-ta="start"
        onClick={workoutCooldownExpanded.toggle}
        title={t("workout.cooldown.toggle")}
        type="button"
        {...ui.Gap.cluster}
        {...workoutCooldownExpanded.props.controller}
      >
        <div data-stack="x" {...ui.Gap.block}>
          <Snowflake data-color="neutral-600" data-shrink="0" data-size="sm" />

          <ui.Eyebrow data-grow="1">{t("workout.cooldown.label")}</ui.Eyebrow>

          {workoutCooldownExpanded.on && (
            <ChevronUp data-color="neutral-500" data-shrink="0" data-size="sm" />
          )}

          {workoutCooldownExpanded.off && (
            <ChevronDown data-color="neutral-500" data-shrink="0" data-size="sm" />
          )}
        </div>

        {workoutCooldownExpanded.on && (
          <span className="c-prose" data-pl="8">
            {workout.data.planSectionCooldown}
          </span>
        )}
      </button>
    </div>
  );
}
