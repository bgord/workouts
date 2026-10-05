import { LineChartMath as Chart, type LineChartLayout } from "../services/line-chart";

export function LineChart(
  props: React.JSX.IntrinsicElements["svg"] & { layout: LineChartLayout; start: string; end: string },
) {
  const { layout, start, end, children, ...rest } = props;
  const widest = layout.gridLines.reduce((a, b) => (b.text.length > a.text.length ? b : a));

  return (
    <div className="line-chart">
      <div aria-hidden className="line-chart-axis">
        <span data-sizer>{widest.text}</span>

        {layout.gridLines.map((gridLine) => (
          <span data-tick key={gridLine.value} style={{ top: `${(gridLine.y / Chart.HEIGHT) * 100}%` }}>
            {gridLine.text}
          </span>
        ))}
      </div>

      <svg role="img" viewBox={`0 0 ${Chart.WIDTH} ${Chart.HEIGHT}`} width="100%" {...rest}>
        <g data-color="neutral-800" stroke="currentColor">
          {layout.gridLines.map((gridLine) => (
            <line
              key={gridLine.value}
              x1={layout.plot.left}
              x2={layout.plot.right}
              y1={gridLine.y}
              y2={gridLine.y}
            />
          ))}
        </g>

        {children}
      </svg>

      <div aria-hidden className="line-chart-dates">
        <span>{start}</span>

        <span>{end}</span>
      </div>
    </div>
  );
}

export function LineChartArea(props: { layout: LineChartLayout }) {
  return (
    <>
      <polygon
        data-color="brand-500"
        fill="currentColor"
        fillOpacity={Chart.AREA_OPACITY}
        points={props.layout.area}
      />

      <polyline
        data-color="brand-400"
        fill="none"
        points={props.layout.line}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </>
  );
}
