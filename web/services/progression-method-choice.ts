import type { ProgressionMethodOptions } from "../../modules/plans/value-objects/progression-method-options";

export const ProgressionMethodChoice = {
  keep: (options: ReadonlyArray<ProgressionMethodOptions>, current: ProgressionMethodOptions | undefined) =>
    options.find((option) => option === current) ?? options[0],
};
