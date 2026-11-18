const WIDTH = 72;
const HEIGHT = 24;
const PADDING = 3;

export const SparklineMath = {
  WIDTH,
  HEIGHT,
  MINIMAL_POINTS: 2,

  points: (values: ReadonlyArray<number>) => {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min;

    return values.map((value, index) => ({
      x: PADDING + (index * (WIDTH - 2 * PADDING)) / (values.length - 1),
      y: span === 0 ? HEIGHT / 2 : PADDING + ((max - value) * (HEIGHT - 2 * PADDING)) / span,
    }));
  },
};
