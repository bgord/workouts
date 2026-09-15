import * as bg from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { ChevronDown, ChevronRight, Info, Pencil, Target } from "lucide-react";
import type { WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import type { Workout } from "../../modules/workouts/value-objects/workout";
import { WorkoutStatusEnum } from "../../modules/workouts/value-objects/workout-status";
import { ExerciseImage, ExerciseImageSize } from "../components/exercise-image";
import { SetDots } from "../components/set-dots";
import { SetsReps } from "../components/sets-reps";
import { SetsRepsLoad } from "../components/sets-reps-load";
import { usePersistedToggle } from "../hooks/use-persisted-toggle";
import { WorkoutExerciseRemove } from "./workout-exercise-remove";
import { WorkoutExerciseTargetSet } from "./workout-exercise-target-set";
import { WorkoutSetList } from "./workout-set-list";
import { WorkoutSetLog } from "./workout-set-log";

const body = { flexBasis: 0, minWidth: 0 };
const spacer = { ...bg.Rhythm(16).times(1).width, textAlign: "center" as const };

export function WorkoutExerciseRow(props: {
  workout: Workout;
  exercise: WorkoutExercise;
  index: number;
  last: boolean;
}) {
  const t = bg.useTranslations();

  const exercise = {
    id: props.exercise.exerciseId,
    name: props.exercise.exerciseName,
    imageEtag: props.exercise.exerciseImageEtag,
  };

  const completed = props.workout.status === WorkoutStatusEnum.completed;
  const skipped = completed && props.exercise.loggedSets.length === 0;

  const expandable = props.exercise.loggedSets.length > 0 || props.exercise.actions.setLog.available;

  const open = usePersistedToggle({ name: `workout-exercise-${props.exercise.id}` });
  const target = bg.useToggle({ name: `workout-exercise-target-${props.exercise.id}` });
  const description = bg.useToggle({ name: `workout-exercise-description-${props.exercise.id}` });

  return (
    <li
      data-bct={props.index === 0 ? undefined : "alpha-soft"}
      data-bst={props.index === 0 ? undefined : "solid"}
      data-bwt={props.index === 0 ? undefined : "hairline"}
      data-gap="2"
      data-pb={props.last ? undefined : "4"}
      data-pt={props.index === 0 ? undefined : "4"}
      data-stack="y"
    >
      <div data-cross="center" data-gap="3" data-md-gap="2" data-stack="x" data-wrap="nowrap">
        {expandable ? (
          <button
            aria-label={open.on ? t("workout.exercise.collapse") : t("workout.exercise.expand")}
            data-color="neutral-400"
            data-cursor="pointer"
            data-hover-color="neutral-0"
            data-md-p="1"
            data-p="2-5"
            data-shrink="0"
            data-stack="x"
            onClick={open.toggle}
            title={open.on ? t("workout.exercise.collapse") : t("workout.exercise.expand")}
            type="button"
            {...open.props.controller}
          >
            {open.on ? <ChevronDown data-size="sm" /> : <ChevronRight data-size="sm" />}
          </button>
        ) : (
          <div
            aria-hidden
            data-color="neutral-600"
            data-fs="xs"
            data-md-p="1"
            data-p="2-5"
            data-shrink="0"
            data-stack="x"
            data-transform="font-variant-numeric"
          >
            <span style={spacer}>{props.workout.status === WorkoutStatusEnum.draft && props.index + 1}</span>
          </div>
        )}

        <Link
          aria-hidden
          data-shrink="0"
          data-stack="x"
          params={{ exerciseId: props.exercise.exerciseId }}
          tabIndex={-1}
          to="/catalog/exercise/$exerciseId"
        >
          <ExerciseImage size={ExerciseImageSize.xs} {...exercise} />
        </Link>

        <div data-gap="1" data-grow="1" data-stack="y" style={body}>
          <Link
            data-color="neutral-100"
            data-fs="sm"
            data-fw="medium"
            data-hover-color="brand-300"
            data-transform="truncate"
            params={{ exerciseId: props.exercise.exerciseId }}
            title={props.exercise.exerciseName}
            to="/catalog/exercise/$exerciseId"
          >
            {props.exercise.exerciseName}
          </Link>

          <div data-cross="baseline" data-gap="2" data-stack="x" data-wrap="nowrap">
            {props.exercise.actions.targetSet.available ? (
              <button
                data-bc={props.exercise.target ? undefined : "neutral-700"}
                data-br="sm"
                data-bs={props.exercise.target ? undefined : "dashed"}
                data-bw={props.exercise.target ? undefined : "hairline"}
                data-color={props.exercise.target ? "neutral-300" : "neutral-400"}
                data-cross="center"
                data-cursor="pointer"
                data-fs={props.exercise.target ? "sm" : "xs"}
                data-fw={props.exercise.target ? "medium" : undefined}
                data-gap="1"
                data-hover-color="neutral-0"
                data-px={props.exercise.target ? undefined : "2"}
                data-py={props.exercise.target ? undefined : "0-5"}
                data-shrink="0"
                data-stack="x"
                data-transform="font-variant-numeric"
                data-wrap="nowrap"
                disabled={!props.exercise.actions.targetSet.enabled}
                onClick={target.toggle}
                title={t("workout.target.cta")}
                type="button"
                {...target.props.controller}
              >
                <Target data-color="brand-400" data-size="xs" />

                {props.exercise.target ? (
                  <>
                    <SetsRepsLoad
                      load={props.exercise.target.load}
                      reps={props.exercise.target.reps}
                      sets={props.exercise.target.sets}
                    />
                    <Pencil data-color="neutral-600" data-ml="1" data-size="xs" />
                  </>
                ) : (
                  t("workout.target.cta")
                )}
              </button>
            ) : (
              props.exercise.target && (
                <div
                  data-color="neutral-300"
                  data-cross="center"
                  data-fs="sm"
                  data-fw="medium"
                  data-gap="1"
                  data-shrink="0"
                  data-stack="x"
                  data-transform="font-variant-numeric"
                  data-wrap="nowrap"
                >
                  <Target data-color="brand-400" data-size="xs" />
                  <SetsRepsLoad
                    load={props.exercise.target.load}
                    reps={props.exercise.target.reps}
                    sets={props.exercise.target.sets}
                  />
                </div>
              )
            )}

            <div
              data-color="neutral-500"
              data-fs="xs"
              data-md-disp={props.exercise.target ? "none" : undefined}
              data-transform="font-variant-numeric"
            >
              <SetsReps {...props.exercise.prescription} />
            </div>
          </div>
        </div>

        {skipped && (
          <div className="c-badge" data-color="neutral-400" data-shrink="0" data-variant="outline">
            {t("workout.exercise.skipped")}
          </div>
        )}

        {!skipped && props.exercise.target && props.workout.status !== WorkoutStatusEnum.draft && (
          <SetDots done={props.exercise.loggedSets.length} target={props.exercise.target.sets} />
        )}

        <div data-cross="center" data-gap="1" data-shrink="0" data-stack="x" data-wrap="nowrap">
          <button
            aria-label={t("workout.exercise.description.toggle")}
            className="c-button"
            data-color={description.on ? "neutral-0" : "neutral-500"}
            data-hover-color="neutral-0"
            data-px="0"
            data-variant="ghost"
            onClick={description.toggle}
            title={t("workout.exercise.description.toggle")}
            type="button"
            {...bg.Rhythm().times(3).style.width}
            {...description.props.controller}
          >
            <Info data-size="sm" />
          </button>

          {props.exercise.actions.remove.available && (
            <WorkoutExerciseRemove
              action={props.exercise.actions.remove}
              exercise={props.exercise}
              workout={props.workout}
            />
          )}
        </div>
      </div>

      {description.on && (
        <div
          className="c-prose"
          data-color="neutral-300"
          data-fs="sm"
          data-md-pl="0"
          data-pl="12"
          {...description.props.target}
        >
          {props.exercise.exerciseDescription}
        </div>
      )}

      {target.on && props.exercise.actions.targetSet.available && (
        <div data-md-pl="8" data-pl="12">
          <WorkoutExerciseTargetSet
            action={props.exercise.actions.targetSet}
            exercise={props.exercise}
            toggle={target}
            workout={props.workout}
          />
        </div>
      )}

      {expandable && open.on && (
        <div data-gap="0" data-md-pl="0" data-pl="12" data-stack="y" {...open.props.target}>
          <WorkoutSetList exercise={props.exercise} workout={props.workout} />

          {props.exercise.actions.setLog.available && (
            <WorkoutSetLog
              action={props.exercise.actions.setLog}
              exercise={props.exercise}
              workout={props.workout}
            />
          )}
        </div>
      )}
    </li>
  );
}
