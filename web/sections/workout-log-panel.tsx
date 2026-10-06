import * as bg from "@bgord/ui";
import { useLayoutEffect, useRef } from "react";
import type { WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import * as ui from "../components";
import { useLogPanel } from "../hooks/use-log-panel";
import { useOptimisticSet } from "../hooks/use-optimistic-set";
import { useSetCorrection } from "../hooks/use-set-correction";
import { WorkoutLogPanelHead } from "./workout-log-panel-head";
import { WorkoutLogPanelRail } from "./workout-log-panel-rail";
import { WorkoutSetList } from "./workout-set-list";
import { WorkoutSetLog } from "./workout-set-log";

export function WorkoutLogPanel() {
  const { active } = useLogPanel();

  if (!active) return null;

  return (
    <WorkoutLogPanelDialog>
      <WorkoutLogPanelContent exercise={active} key={active.id} />
    </WorkoutLogPanelDialog>
  );
}

function WorkoutLogPanelDialog(props: { children: React.ReactNode }) {
  const t = bg.useTranslations();
  const { close } = useLogPanel();
  const ref = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    ref.current?.showModal();
    ref.current?.focus();
  }, []);

  bg.useClickOutside(ref, close);

  return (
    <dialog
      aria-label={t("workout.log_panel.label")}
      data-backdrop="medium"
      data-bc="alpha-medium"
      data-bg="neutral-900"
      data-bottom="4"
      data-br="lg"
      data-bs="solid"
      data-bw="hairline"
      data-log-panel
      data-mb="0"
      data-md-bottom="0"
      data-md-br="none"
      data-md-bwb="none"
      data-md-bwx="none"
      data-mx="auto"
      data-overflow="hidden"
      data-pb="4"
      data-shadow="lg"
      data-stack="y"
      data-top="auto"
      onClose={close}
      ref={ref}
      style={{ outline: "none" }}
      tabIndex={-1}
      {...ui.Spacing.surfaceCompact}
    >
      {props.children}
    </dialog>
  );
}

function WorkoutLogPanelContent(props: { exercise: WorkoutExercise }) {
  const { exercise, pendingSet, setPendingSet } = useOptimisticSet(props.exercise);
  const correction = useSetCorrection();

  return (
    <>
      <WorkoutLogPanelHead exercise={exercise} />

      {exercise.loggedSets.length > 0 && (
        <div data-minh="0" data-overflow="auto">
          <WorkoutSetList correction={correction} exercise={exercise} flushTop pendingSet={pendingSet} />
        </div>
      )}

      <WorkoutSetLog correcting={correction.active !== null} exercise={exercise} onPending={setPendingSet} />

      <WorkoutLogPanelRail />
    </>
  );
}
