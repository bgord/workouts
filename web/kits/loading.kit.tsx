import type * as bg from "@bgord/ui";
import { Form } from "../../app/services/workout-target-form";
import { ExerciseLoadingOptions } from "../../modules/exercises/value-objects/exercise-loading-options";
import { NoLoadBadge } from "../components/no-load-badge";
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

type LoadingKitStrategy = {
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

export const LoadingKit = {
  [ExerciseLoadingOptions.external]: {
    Field: LoadStepper,
    Badge: () => null,
    payload: (field) => WeightFormat.grams(field.value ?? 0),
    ready: (field) => !field.empty,
  },
  [ExerciseLoadingOptions.none]: {
    Field: () => null,
    Badge: NoLoadBadge,
    payload: () => 0,
    ready: () => true,
  },
} satisfies Record<ExerciseLoadingOptions, LoadingKitStrategy>;
