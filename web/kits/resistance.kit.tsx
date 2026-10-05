import type * as bg from "@bgord/ui";
import { Form } from "../../app/services/workout-target-form";
import { ExerciseResistanceOptions } from "../../modules/exercises/value-objects/exercise-resistance-options";
import { BodyweightBadge } from "../components/bodyweight-badge";
import { Stepper } from "../components/stepper";
import { WeightFormat } from "../services/weight-format";

type LoadField = bg.UseNumberFieldReturnType<number>;

type LoadFieldProps = {
  field: LoadField;
  label: string;
  separator: React.ReactNode;
  disabled?: boolean;
  variant?: "default" | "compact";
};

type ResistanceKitStrategy = {
  Field: (props: LoadFieldProps) => React.ReactNode;
  Badge: () => React.ReactNode;
  payload: (field: LoadField) => number;
  ready: (field: LoadField) => boolean;
};

function LoadStepper(props: LoadFieldProps) {
  return (
    <>
      {props.separator}

      <Stepper
        disabled={props.disabled}
        field={props.field}
        label={props.label}
        unit="kg"
        variant={props.variant}
        width={52}
        {...Form.load.pattern}
      />
    </>
  );
}

export const ResistanceKit = {
  [ExerciseResistanceOptions.weighted]: {
    Field: LoadStepper,
    Badge: () => null,
    payload: (field) => WeightFormat.grams(field.value ?? 0),
    ready: (field) => !field.empty,
  },
  [ExerciseResistanceOptions.bodyweight]: {
    Field: () => null,
    Badge: BodyweightBadge,
    payload: () => 0,
    ready: () => true,
  },
} satisfies Record<ExerciseResistanceOptions, ResistanceKitStrategy>;
