// cSpell:ignore sparkline
import { SparklineMath } from "../services/sparkline";

export function Sparkline(
  props: Omit<React.JSX.IntrinsicElements["svg"], "values"> & { values: ReadonlyArray<number> },
) {
  const { values, ...svg } = props;
  const style = { width: SparklineMath.WIDTH, height: SparklineMath.HEIGHT };

  if (values.length < SparklineMath.MINIMAL_POINTS) {
    return <svg aria-hidden data-shrink="0" style={style} {...svg} />;
  }

  const points = SparklineMath.points(values);
  const last = points.at(-1)!;

  return (
    <svg
      aria-hidden
      data-shrink="0"
      style={style}
      viewBox={`0 0 ${SparklineMath.WIDTH} ${SparklineMath.HEIGHT}`}
      {...svg}
    >
      <polyline
        data-color="neutral-500"
        fill="none"
        points={points.map((point) => `${point.x},${point.y}`).join(" ")}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <circle cx={last.x} cy={last.y} data-color="brand-400" fill="currentColor" r={2.5} />
    </svg>
  );
}
