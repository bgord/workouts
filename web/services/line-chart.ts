// cSpell:ignore GRIDLINE GRIDLINES
const WIDTH = 600;
const HEIGHT = 200;
const PADDING = { top: 12, right: 0, bottom: 26 };
const LABEL_FONT_SIZE = 11;
const LABEL_CHAR_WIDTH = LABEL_FONT_SIZE * 0.6;
const SCALE_MARGIN = 1;
const GRIDLINES_LIMIT = 5;
const GRIDLINE_LABEL_GAP = 8;
const COORDINATE_PRECISION = 10;

const round = (coordinate: number) => Math.round(coordinate * COORDINATE_PRECISION) / COORDINATE_PRECISION;

export type LineChartLayout = ReturnType<typeof LineChartMath.layout>;

export const LineChartMath = {
  WIDTH,
  HEIGHT,
  LABEL_FONT_SIZE,
  DATE_LABEL_BASELINE: HEIGHT - 6,
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

    const left =
      Math.max(...labels.map((label) => label.text.length)) * LABEL_CHAR_WIDTH + GRIDLINE_LABEL_GAP;

    const plot = {
      top: PADDING.top,
      right: WIDTH - PADDING.right,
      bottom: HEIGHT - PADDING.bottom,
      left,
      width: WIDTH - left - PADDING.right,
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
