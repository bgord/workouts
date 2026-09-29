const MILLIMETERS_IN_CENTIMETER = 10;

export const LengthFormat = {
  centimeters: (millimeters: number) => Number((millimeters / MILLIMETERS_IN_CENTIMETER).toFixed(1)),
  millimeters: (centimeters: number) => Math.round(centimeters * MILLIMETERS_IN_CENTIMETER),
  parse: (typed: string) => {
    const centimeters = Number(typed);

    return typed !== "" && centimeters > 0 ? LengthFormat.millimeters(centimeters) : null;
  },
};
