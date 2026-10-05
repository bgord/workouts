// cSpell:ignore GRIDLINE GRIDLINES
const WIDTH = 600;
const HEIGHT = 200;
const PADDING = { top: 8, right: 6, bottom: 8, left: 6 };
const SCALE_MARGIN = 1;
const GRIDLINES_LIMIT = 5;
const COORDINATE_PRECISION = 10;

const round = (coordinate: number) => Math.round(coordinate * COORDINATE_PRECISION) / COORDINATE_PRECISION;

export type LineChartLayout = ReturnType<typeof LineChartMath.layout>;

export const LineChartMath = {
  WIDTH,
  HEIGHT,
  AREA_OPACITY: 0.08,
  MINIMAL_POINTS: 2,

  layout: (values: Array<number>, format: (value: number) => string) => {
    const floor = Math.max(Math.floor(Math.min(...values)) - SCALE_MARGIN, 0);
    const roughCeiling = Math.ceil(Math.max(...values)) + SCALE_MARGIN;
    const step = Math.ceil((roughCeiling - floor) / GRIDLINES_LIMIT);
    const ceiling = floor + Math.ceil((roughCeiling - floor) / step) * step;

    const labels = Array.from({ length: (ceiling - floor) / step + 1 }, (_, index) => {
      const value = floor + index * step;

      return { value, text: format(value) };
    });

    const plot = {
      top: PADDING.top,
      right: WIDTH - PADDING.right,
      bottom: HEIGHT - PADDING.bottom,
      left: PADDING.left,
      width: WIDTH - PADDING.left - PADDING.right,
      height: HEIGHT - PADDING.top - PADDING.bottom,
    };

    const toY = (value: number) => round(plot.bottom - ((value - floor) / (ceiling - floor)) * plot.height);

    const gridLines = labels.map((label) => ({ ...label, y: toY(label.value) }));

    const points = values.map((value, index) => ({
      x: round(plot.left + (index * plot.width) / (values.length - 1)),
      y: toY(value),
    }));

    const first = points[0]!;
    const last = points.at(-1)!;
    const line = points.map((point) => `${point.x},${point.y}`).join(" ");

    return {
      plot,
      gridLines,
      points,
      line,
      area: `${first.x},${plot.bottom} ${line} ${last.x},${plot.bottom}`,
    };
  },
};
