const GRAMS_IN_KILOGRAM = 1000;

export const BodyWeightDecimals = 2;

export const WeightFormat = {
  kilograms: (grams: number, decimals = 1) => Number((grams / GRAMS_IN_KILOGRAM).toFixed(decimals)),
  grams: (kilograms: number) => Math.round(kilograms * GRAMS_IN_KILOGRAM),
};
