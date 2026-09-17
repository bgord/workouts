import { Triangle } from "lucide-react";
import { WeightFormat } from "../services/weight-format";
import { Gap } from "./gap";

export function DeltaKg(props: { current: number; previous: number | undefined; decimals?: number }) {
  if (props.previous === undefined) return null;

  const difference = props.current - props.previous;

  if (difference === 0) return null;

  const positive = difference > 0;

  return (
    <span
      data-color={positive ? "positive-400" : "danger-400"}
      data-cross="center"
      data-stack="x"
      data-transform="nowrap"
      data-wrap="nowrap"
      {...Gap.inline}
    >
      <Triangle data-rotate={positive ? "0" : "180"} fill="currentColor" size={9} strokeWidth={0} />

      {WeightFormat.kilograms(Math.abs(difference), props.decimals)}

      {" kg"}
    </span>
  );
}
