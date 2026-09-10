const PADDING_RATIO = 10;
const MINIMAL_PADDING = 1;

export const ChartScale = {
  of: (values: Array<number>) => {
    const lowest = Math.min(...values);
    const highest = Math.max(...values);
    const padding = (highest - lowest) / PADDING_RATIO || highest / PADDING_RATIO || MINIMAL_PADDING;

    const floor = Math.max(lowest - padding, 0);
    const ceiling = highest + padding;

    return {
      at: (ratio: number) => floor + (ceiling - floor) * ratio,
      ratio: (value: number) => (value - floor) / (ceiling - floor),
    };
  },
};
