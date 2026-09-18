import * as bg from "@bgord/ui";
import { Gap } from "./gap";

export function Prescription(props: React.JSX.IntrinsicElements["div"]) {
  return (
    <div
      data-cross="center"
      data-stack="x"
      data-wrap="nowrap"
      {...bg.Rhythm(336).times(1).style.maxWidth}
      {...Gap.cluster}
      {...props}
    />
  );
}
