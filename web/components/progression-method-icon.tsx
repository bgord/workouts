import { TrendingUp } from "lucide-react";
import { ProgressionMethodOptions } from "../../modules/plans/value-objects/progression-method-options";

const icons = { [ProgressionMethodOptions.double_progression]: TrendingUp };

export function ProgressionMethodIcon(props: { method: ProgressionMethodOptions; size?: "xs" | "sm" }) {
  const Icon = icons[props.method];

  return <Icon data-size={props.size ?? "sm"} />;
}
