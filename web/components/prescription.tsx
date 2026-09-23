import * as bg from "@bgord/ui";
import { Gap } from "./gap";

export function Prescription(props: React.JSX.IntrinsicElements["div"]) {
  return <div data-stack="x" {...bg.Rhythm(336).times(1).style.maxWidth} {...Gap.cluster} {...props} />;
}
