import { LineChartMath as Chart, type LineChartLayout } from "../services/line-chart";

export function LineChart(props: React.JSX.IntrinsicElements["svg"]) {
  return <svg role="img" viewBox={`0 0 ${Chart.WIDTH} ${Chart.HEIGHT}`} width="100%" {...props} />;
}

export function LineChartGrid(props: { layout: LineChartLayout; start: string; end: string }) {
  const { plot, gridLines } = props.layout;

  return (
    <>
      <g data-color="neutral-800" stroke="currentColor">
        {gridLines.map((gridLine) => (
          <line key={gridLine.value} x1={plot.left} x2={plot.right} y1={gridLine.y} y2={gridLine.y} />
        ))}
      </g>

      <g data-color="neutral-500" fill="currentColor" fontSize={Chart.LABEL_FONT_SIZE}>
        {gridLines.map((gridLine) => (
          <text dominantBaseline="middle" key={gridLine.value} x={0} y={gridLine.y}>
            {gridLine.text}
          </text>
        ))}

        <text x={plot.left} y={Chart.DATE_LABEL_BASELINE}>
          {props.start}
        </text>

        <text textAnchor="end" x={plot.right} y={Chart.DATE_LABEL_BASELINE}>
          {props.end}
        </text>
      </g>
    </>
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
