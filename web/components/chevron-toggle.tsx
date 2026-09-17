import type * as bg from "@bgord/ui";
import { ChevronDown, ChevronRight } from "lucide-react";

export function ChevronToggle(props: bg.UseToggleReturnType) {
  return (
    <button
      data-color="neutral-400"
      data-cursor="pointer"
      data-hover-color="neutral-0"
      data-md-p="1"
      data-p="2-5"
      data-shrink="0"
      data-stack="x"
      onClick={props.toggle}
      type="button"
      {...props.props.controller}
    >
      {props.on ? <ChevronDown data-size="sm" /> : <ChevronRight data-size="sm" />}
    </button>
  );
}
