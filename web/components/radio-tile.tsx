import { Circle, CircleCheck } from "lucide-react";
import { Gap } from "./gap";
import { Spacing } from "./spacing";

export function RadioTile(props: React.JSX.IntrinsicElements["label"] & { selected: boolean }) {
  const { selected, children, ...rest } = props;

  return (
    <label
      data-bc={selected ? "brand-500" : "neutral-800"}
      data-br="md"
      data-bs="solid"
      data-bw="hairline"
      data-cursor="pointer"
      data-hover-bc={selected ? "brand-500" : "neutral-600"}
      data-stack="x"
      {...Spacing.surfaceCompact}
      {...Gap.related}
      {...rest}
    >
      {selected ? (
        <CircleCheck data-color="brand-400" data-shrink="0" data-size="sm" />
      ) : (
        <Circle data-color="neutral-600" data-shrink="0" data-size="sm" />
      )}

      {children}
    </label>
  );
}
