import * as tools from "@bgord/tools";

export const DumbbellRack: ReadonlyArray<tools.Weight> = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 12.5, 14, 15, 16, 17.5, 18, 20, 22, 22.5, 24, 25, 26, 28, 30, 32, 34, 36,
  38, 40, 42, 44, 46, 48, 50,
].map((kilograms) => tools.Weight.fromKilograms(kilograms));
