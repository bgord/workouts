import type * as bg from "@bgord/ui";
import { RepsSchemeOptions } from "../../modules/plans/value-objects/reps-scheme-options";
import { Separator } from "../components/separator";
import { Stepper } from "../components/stepper";

type RepsField = bg.UseNumberFieldReturnType<number>;

type MaxRepsFieldProps = {
  "aria-label": string;
  field: RepsField;
  min: number;
  max: number;
  step: number;
} & Pick<React.JSX.IntrinsicElements["input"], "disabled">;

type RepsSchemeKitStrategy = {
  Field: (props: MaxRepsFieldProps) => React.ReactNode;
  payload: (min: RepsField, max: RepsField) => { min: RepsField["value"]; max?: RepsField["value"] };
  ready: (max: RepsField) => boolean;
  unchanged: (max: RepsField) => boolean;
  align: (min: RepsField, max: RepsField) => void;
  toggled: RepsSchemeOptions;
};

function MaxRepsStepper(props: MaxRepsFieldProps) {
  return (
    <>
      <Separator>–</Separator>

      <Stepper variant="fill" {...props} />
    </>
  );
}

export const RepsSchemeKit = {
  [RepsSchemeOptions.range]: {
    Field: MaxRepsStepper,
    payload: (min, max) => ({ min: min.value, max: max.value }),
    ready: (max) => !max.empty,
    unchanged: (max) => max.unchanged,
    align: (min, max) => {
      if (min.value !== undefined && (max.value === undefined || max.value < min.value)) max.set(min.value);
    },
    toggled: RepsSchemeOptions.amrap,
  },
  [RepsSchemeOptions.amrap]: {
    Field: () => <Separator>+</Separator>,
    payload: (min) => ({ min: min.value }),
    ready: () => true,
    unchanged: () => true,
    align: () => {},
    toggled: RepsSchemeOptions.range,
  },
} satisfies Record<RepsSchemeOptions, RepsSchemeKitStrategy>;
