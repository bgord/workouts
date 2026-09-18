import { Rhythm } from "@bgord/ui";
import { Gap } from "./gap";

export function Prescription(props: React.JSX.IntrinsicElements["div"]) {
  return (
    <div
      data-cross="center"
      data-stack="x"
      data-wrap="nowrap"
      {...Rhythm(336).times(1).style.maxWidth}
      {...Gap.cluster}
      {...props}
    />
  );
}
