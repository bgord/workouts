import { ProgressionMethodOptions } from "../../modules/plans/value-objects/progression-method-options";
import { RepsScheme } from "../../modules/plans/value-objects/reps-scheme";
import type { RepsSchemeOptions } from "../../modules/plans/value-objects/reps-scheme-options";

const options = (methods: ReadonlyArray<ProgressionMethodOptions> | undefined, scheme: RepsSchemeOptions) =>
  (methods ?? Object.values(ProgressionMethodOptions)).filter((method) =>
    RepsScheme.allowsProgression(scheme, method),
  );

export const ProgressionMethodChoice = {
  options,
  keep: (
    methods: ReadonlyArray<ProgressionMethodOptions> | undefined,
    scheme: RepsSchemeOptions,
    current: ProgressionMethodOptions | undefined,
  ) => {
    const available = options(methods, scheme);

    return available.find((method) => method === current) ?? available[0];
  },
};
