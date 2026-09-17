import * as bg from "@bgord/ui";
import { ChevronDown, ChevronRight } from "lucide-react";

export function ChevronToggle(props: bg.UseToggleReturnType & { collapse: string; expand: string }) {
  const { toggle, rest } = bg.extractUseToggle(props);
  const label = toggle.on ? rest.collapse : rest.expand;

  return (
    <button
      aria-label={label}
      data-color="neutral-400"
      data-cursor="pointer"
      data-hover-color="neutral-0"
      data-md-p="1"
      data-p="2-5"
      data-shrink="0"
      data-stack="x"
      onClick={toggle.toggle}
      title={label}
      type="button"
      {...toggle.props.controller}
    >
      {toggle.on ? <ChevronDown data-size="sm" /> : <ChevronRight data-size="sm" />}
    </button>
  );
}
