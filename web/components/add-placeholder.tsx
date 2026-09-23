import * as bg from "@bgord/ui";
import { Plus } from "lucide-react";

export function AddPlaceholder(props: React.JSX.IntrinsicElements["div"]) {
  return (
    <div
      data-bc="alpha-medium"
      data-br="sm"
      data-bs="dashed"
      data-bw="hairline"
      data-color="neutral-500"
      data-main="center"
      data-shrink="0"
      data-stack="x"
      {...bg.Rhythm().times(3).style.square}
      {...props}
    >
      <Plus data-size="sm" />
    </div>
  );
}
