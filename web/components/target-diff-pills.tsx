import * as bg from "@bgord/ui";
import { Equal } from "lucide-react";
import type { ExerciseTargetDiff } from "../../modules/workouts/value-objects/exercise-target-diff";
import { useTargetDiffLabel } from "../hooks/use-target-diff-label";
import { Gap } from "./gap";

function TargetDiffPill(props: { value: number; children: React.ReactNode }) {
  return (
    <span className="c-badge" data-tone="soft" data-variant={props.value > 0 ? "positive" : "danger"}>
      {props.children}
    </span>
  );
}

export function TargetDiffPills(props: { diff: ExerciseTargetDiff } & React.JSX.IntrinsicElements["span"]) {
  const { diff, ...rest } = props;
  const t = bg.useTranslations();
  const label = useTargetDiffLabel();

  const unchanged = diff.sets === 0 && diff.reps === 0 && diff.load === 0;

  return (
    <span
      data-stack="x"
      data-transform="font-variant-numeric"
      title={t("workout.previous_performance.diff.title")}
      {...Gap.inline}
      {...rest}
    >
      {unchanged && (
        <span className="c-badge" data-tone="soft" data-variant="outline">
          <Equal data-size="xs" />
        </span>
      )}

      {diff.sets !== 0 && <TargetDiffPill value={diff.sets}>{label.sets(diff.sets)}</TargetDiffPill>}

      {diff.reps !== 0 && <TargetDiffPill value={diff.reps}>{label.reps(diff.reps)}</TargetDiffPill>}

      {diff.load !== 0 && <TargetDiffPill value={diff.load}>{label.load(diff.load)}</TargetDiffPill>}
    </span>
  );
}
