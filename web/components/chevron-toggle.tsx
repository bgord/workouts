import * as bg from "@bgord/ui";
import { ChevronDown, ChevronRight } from "lucide-react";

export function ChevronToggle(props: React.JSX.IntrinsicElements["button"] & bg.UseToggleReturnType) {
  const { toggle, rest } = bg.extractUseToggle(props);

  return (
    <button
      data-color="neutral-400"
      data-cursor="pointer"
      data-hover-color="neutral-0"
      data-md-p="1"
      data-p="2-5"
      data-shrink="0"
      data-stack="x"
      onClick={toggle.toggle}
      title={rest["aria-label"]}
      type="button"
      {...toggle.props.controller}
      {...rest}
    >
      {toggle.on ? <ChevronDown data-size="sm" /> : <ChevronRight data-size="sm" />}
    </button>
  );
}
