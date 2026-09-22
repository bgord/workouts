import * as bg from "@bgord/ui";
import { Check } from "lucide-react";

export function StepperSubmit(props: React.JSX.IntrinsicElements["button"]) {
  return (
    <button
      data-bcl="neutral-800"
      data-bg="alpha-subtle"
      data-bsl="solid"
      data-bwl="hairline"
      data-color="positive-400"
      data-cross="center"
      data-cursor="pointer"
      data-disp="flex"
      data-focus-ring-offset="inset"
      data-hover-bg="alpha-soft"
      data-main="center"
      data-shrink="0"
      type="submit"
      {...bg.Rhythm(34).times(1).style.square}
      {...props}
    >
      <Check data-size="sm" />
    </button>
  );
}
