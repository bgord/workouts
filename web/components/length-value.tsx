import { useLengthValue } from "../hooks/use-length-value";

export function LengthValue(props: { millimeters: number }) {
  const lengthValue = useLengthValue();

  return lengthValue(props.millimeters);
}
