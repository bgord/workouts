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
    <div data-stack="y" {...ui.Spacing.inset}>
      <button
        aria-label={t("workout.cooldown.toggle")}
        data-bc="neutral-800"
        data-bg="neutral-900"
        data-br="md"
        data-bw="hairline"
        data-cross={workoutCooldownExpanded.on ? "start" : "center"}
        data-cursor="pointer"
        data-p="3"
        data-stack="x"
        data-ta="start"
        data-wrap="nowrap"
        onClick={workoutCooldownExpanded.toggle}
        title={t("workout.cooldown.toggle")}
        type="button"
        {...ui.Gap.related}
        {...workoutCooldownExpanded.props.controller}
      >
        <Snowflake data-color="positive-400" data-shrink="0" data-size="sm" />

        {workoutCooldownExpanded.on && (
          <div data-grow="1" data-minw="0" data-stack="y" {...ui.Gap.cluster}>
            <ui.Eyebrow>{t("workout.cooldown.label")}</ui.Eyebrow>

            <span className="c-prose" data-color="neutral-200" data-fs="sm" data-ws="pre-line">
              {workout.data.planSectionCooldown}
            </span>
          </div>
        )}

        {workoutCooldownExpanded.off && <ui.Eyebrow data-grow="1">{t("workout.cooldown.label")}</ui.Eyebrow>}

        {workoutCooldownExpanded.on && <ChevronUp data-color="neutral-500" data-shrink="0" data-size="sm" />}

        {!workoutCooldownExpanded.on && (
          <ChevronDown data-color="neutral-500" data-shrink="0" data-size="sm" />
        )}
      </button>
    </div>
  );
}
