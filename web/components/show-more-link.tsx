import * as bg from "@bgord/ui";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TextLink } from "./text-link";

export function ShowMoreLink(
  props: React.JSX.IntrinsicElements["button"] & { more: string; less: string } & bg.UseToggleReturnType,
) {
  const { toggle, rest } = bg.extractUseToggle(props);
  const { more, less, ...button } = rest;

  return (
    <TextLink onClick={toggle.toggle} {...button}>
      {toggle.on ? less : more}
      {toggle.on ? <ChevronUp data-size="xs" /> : <ChevronDown data-size="xs" />}
    </TextLink>
  );
}
