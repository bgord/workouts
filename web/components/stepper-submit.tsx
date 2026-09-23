import * as bg from "@bgord/ui";
import { Check } from "lucide-react";

export function StepperSubmit(props: React.JSX.IntrinsicElements["button"]) {
  return (
    <button
      data-bcl="alpha-soft"
      data-bg="alpha-subtle"
      data-bsl="solid"
      data-bwl="hairline"
      data-color="positive-400"
      data-cursor="pointer"
      data-focus-ring-offset="inset"
      data-hover-bg="alpha-soft"
      data-main="center"
      data-shrink="0"
      data-stack="x"
      type="submit"
      {...bg.Rhythm(34).times(1).style.square}
      {...props}
    >
      <Check data-size="sm" />
    </button>
  );
}
