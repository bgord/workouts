import type * as bg from "@bgord/ui";
import { Form } from "../../app/services/workout-target-form";
import { ExerciseResistanceOptions } from "../../modules/exercises/value-objects/exercise-resistance-options";
import { BodyweightBadge, BodyweightGlyph, BodyweightMarker } from "../components/bodyweight-badge";
import { Stepper } from "../components/stepper";
import { WeightFormat } from "../services/weight-format";

type LoadField = bg.UseNumberFieldReturnType<number>;

type LoadFieldProps = {
  "aria-label": string;
  field: LoadField;
  separator: React.ReactNode;
  variant?: "default" | "compact";
} & Pick<React.JSX.IntrinsicElements["input"], "disabled">;

type ResistanceKitStrategy = {
  Field: (props: LoadFieldProps) => React.ReactNode;
  Badge: (props: React.JSX.IntrinsicElements["span"]) => React.ReactNode;
  Marker: (props: React.JSX.IntrinsicElements["span"]) => React.ReactNode;
  Glyph: (props: React.JSX.IntrinsicElements["svg"]) => React.ReactNode;
  payload: (field: LoadField) => number;
  ready: (field: LoadField) => boolean;
};

function LoadStepper(props: LoadFieldProps) {
  return (
    <>
      {props.separator}

      <Stepper
        aria-label={props["aria-label"]}
        disabled={props.disabled}
        field={props.field}
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
    Marker: () => null,
    Glyph: () => null,
    payload: (field) => WeightFormat.grams(field.value ?? 0),
    ready: (field) => !field.empty,
  },
  [ExerciseResistanceOptions.bodyweight]: {
    Field: () => null,
    Badge: BodyweightBadge,
    Marker: BodyweightMarker,
    Glyph: BodyweightGlyph,
    payload: () => 0,
    ready: () => true,
  },
} satisfies Record<ExerciseResistanceOptions, ResistanceKitStrategy>;
