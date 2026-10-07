import { ArrowUp, ChevronsUp, Equal, TrendingUp } from "lucide-react";
import { ProgressionMethodOptions } from "../../modules/plans/value-objects/progression-method-options";

const icons = {
  [ProgressionMethodOptions.double_progression]: TrendingUp,
  [ProgressionMethodOptions.linear_progression]: ArrowUp,
  [ProgressionMethodOptions.rep_progression]: ChevronsUp,
  [ProgressionMethodOptions.none]: Equal,
};

export function ProgressionMethodIcon(props: { method: ProgressionMethodOptions; size?: "xs" | "sm" }) {
  const Icon = icons[props.method];

  return <Icon data-size={props.size ?? "sm"} />;
}
