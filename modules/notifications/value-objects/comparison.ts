export enum ComparisonDirections {
  up = "up",
  down = "down",
  flat = "flat",
  unknown = "unknown",
}

export type Comparison<T extends number = number> = {
  current: T;
  previous: T | undefined;
  delta: number;
  direction: ComparisonDirections;
};

const direction = (delta: number): ComparisonDirections => {
  if (delta > 0) return ComparisonDirections.up;
  if (delta < 0) return ComparisonDirections.down;
  return ComparisonDirections.flat;
};

export const Comparison = {
  of: <T extends number>(current: T, previous?: T): Comparison<T> => {
    if (previous === undefined) {
      return { current, previous: undefined, delta: 0, direction: ComparisonDirections.unknown };
    }

    const delta = current - previous;

    return { current, previous, delta, direction: direction(delta) };
  },
};
