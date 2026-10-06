import * as bg from "@bgord/ui";
import { ArrowUpDown } from "lucide-react";
import * as ui from "../components";
import { workoutRoute } from "../router";

export function WorkoutReorder(props: bg.UseToggleReturnType) {
  const t = bg.useTranslations();
  const { workout } = workoutRoute.useLoaderData();

  if (!workout.actions.reorder.available || props.on) return null;

  return (
    <ui.MenuItem onClick={props.enable}>
      <ArrowUpDown data-size="sm" />
      {t("workout.exercise.reorder.start.title")}
    </ui.MenuItem>
  );
}

export function WorkoutReorderStrip(props: bg.UseToggleReturnType) {
  const t = bg.useTranslations();
  const { workout } = workoutRoute.useLoaderData();

  if (!workout.actions.reorder.available || props.off) return null;

  return (
    <div
      data-br="md"
      data-bs="solid"
      data-bw="hairline"
      data-color="brand-200"
      data-cross="center"
      data-fs="xs"
      data-pl="3"
      data-pr="2"
      data-py="2"
      data-stack="x"
      role="status"
      style={{
        backgroundColor: "color-mix(in oklch, var(--color-brand-900) 55%, transparent)",
        borderColor: "color-mix(in oklch, var(--color-brand-500) 30%, transparent)",
      }}
      {...ui.Gap.related}
    >
      <ArrowUpDown data-shrink="0" data-size="sm" />

      <span data-grow="1">{t("workout.exercise.reorder.active")}</span>

      <button
        aria-label={t("workout.exercise.reorder.stop.title")}
        className="c-button"
        data-variant="ghost"
        onClick={props.disable}
        title={t("workout.exercise.reorder.stop.title")}
        type="button"
      >
        {t("workout.exercise.reorder.done")}
      </button>
    </div>
  );
}
