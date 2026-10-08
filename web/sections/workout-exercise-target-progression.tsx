import * as bg from "@bgord/ui";
import type { ProgressionMethodType } from "../../modules/plans/value-objects/progression-method";
import type { ExerciseTargetType } from "../../modules/workouts/value-objects/exercise-target";
import type { ExerciseTargetProgression } from "../../modules/workouts/value-objects/exercise-target-progression";
import type { WorkoutExerciseResistanceType } from "../../modules/workouts/value-objects/workout-exercise-resistance";
import * as ui from "../components";
import { useTargetDiffLabel } from "../hooks/use-target-diff-label";
import { ResistanceKit } from "../kits/resistance.kit";
import { WeightFormat } from "../services/weight-format";

type Fields = {
  sets: bg.UseNumberFieldReturnType<number>;
  reps: bg.UseNumberFieldReturnType<number>;
  load: bg.UseNumberFieldReturnType<number>;
};

export function WorkoutExerciseTargetProgression(
  props: {
    progression: ExerciseTargetProgression;
    method: ProgressionMethodType;
    rir: number | undefined;
    resistance: WorkoutExerciseResistanceType;
    disabled: boolean;
  } & Fields,
) {
  const { progression, method, rir, resistance, disabled, sets, reps, load } = props;
  const t = bg.useTranslations();
  const label = useTargetDiffLabel();

  const pressed = (option: ExerciseTargetType) =>
    sets.value === option.sets &&
    reps.value === option.reps &&
    ResistanceKit[resistance].ready(load) &&
    ResistanceKit[resistance].payload(load) === option.load;

  const apply = (option: ExerciseTargetType) => () => {
    sets.set(option.sets);
    reps.set(option.reps);
    load.set(WeightFormat.kilograms(option.load));
  };

  const step = (option: ExerciseTargetType) =>
    option.load === progression.last.load
      ? label.reps(option.reps - progression.last.reps)
      : label.load(option.load - progression.last.load);

  const title = `${t("workout.target.progression.title")} · ${t(`progression.method.${method}`)}`;

  return (
    <fieldset
      aria-label={title}
      data-md-ml="1"
      data-md-pl="8"
      data-pl="12"
      data-stack="x"
      data-transform="font-variant-numeric"
      data-wrap="wrap"
      title={title}
      {...ui.Gap.cluster}
    >
      {progression.regress && (
        <ui.ChipButton
          disabled={disabled}
          onClick={apply(progression.regress)}
          pressed={pressed(progression.regress)}
        >
          {step(progression.regress)}
        </ui.ChipButton>
      )}

      <ui.ChipButton
        disabled={disabled}
        onClick={apply(progression.last)}
        pressed={pressed(progression.last)}
      >
        {t("workout.target.progression.last")}
      </ui.ChipButton>

      {progression.progress && (
        <ui.ChipButton
          disabled={disabled}
          onClick={apply(progression.progress)}
          pressed={pressed(progression.progress)}
        >
          {step(progression.progress)}
        </ui.ChipButton>
      )}

      {progression.hold && (
        <small data-color="neutral-400" data-self="center">
          {t(`workout.target.progression.hold.${progression.hold}`, { rir: rir ?? "" })}
        </small>
      )}
    </fieldset>
  );
}
