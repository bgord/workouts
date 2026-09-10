const GRAMS_IN_KILOGRAM = 1000;

export const WeightFormat = {
  kilograms: (grams: number) => Number((grams / GRAMS_IN_KILOGRAM).toFixed(1)),
  grams: (kilograms: number) => Math.round(kilograms * GRAMS_IN_KILOGRAM),
};
