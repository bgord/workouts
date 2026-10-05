import { Delta } from "./delta";
import { LengthValue } from "./length-value";

export function LengthDelta(
  props: { current: number; previous: number | undefined } & React.JSX.IntrinsicElements["span"],
) {
  return <Delta format={(difference) => <LengthValue millimeters={difference} />} {...props} />;
}
