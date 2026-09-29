// cSpell:ignore sparkline
import { SparklineMath } from "../services/sparkline";

export function Sparkline(props: { values: ReadonlyArray<number> }) {
  const style = { width: SparklineMath.WIDTH, height: SparklineMath.HEIGHT };

  if (props.values.length < SparklineMath.MINIMAL_POINTS) {
    return <span aria-hidden data-shrink="0" style={style} />;
  }

  const points = SparklineMath.points(props.values);
  const last = points.at(-1)!;

  return (
    <svg
      aria-hidden
      data-shrink="0"
      style={style}
      viewBox={`0 0 ${SparklineMath.WIDTH} ${SparklineMath.HEIGHT}`}
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
