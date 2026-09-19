import * as bg from "@bgord/ui";
import { Equal } from "lucide-react";
import type { ExerciseTargetDiff } from "../../modules/workouts/value-objects/exercise-target-diff";
import { WeightFormat } from "../services/weight-format";
import { Gap } from "./gap";

const sign = (value: number) => (value > 0 ? `+${value}` : `−${Math.abs(value)}`);

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
  const pluralize = bg.usePluralize();

  const unchanged = diff.sets === 0 && diff.reps === 0 && diff.load === 0;

  return (
    <span
      data-cross="center"
      data-stack="x"
      data-transform="font-variant-numeric"
      data-wrap="nowrap"
      title={t("workout.previous_performance.diff.title")}
      {...Gap.inline}
      {...rest}
    >
      {unchanged && (
        <span className="c-badge" data-tone="soft" data-variant="outline">
          <Equal data-size="xs" />
        </span>
      )}

      {diff.sets !== 0 && (
        <TargetDiffPill value={diff.sets}>
          {t("workout.previous_performance.diff.sets", {
            value: sign(diff.sets),
            noun: pluralize({
              value: Math.abs(diff.sets),
              singular: t("workout.previous_performance.diff.sets.noun.singular"),
              plural: t("workout.previous_performance.diff.sets.noun.plural"),
              genitive: t("workout.previous_performance.diff.sets.noun.genitive"),
            }),
          })}
        </TargetDiffPill>
      )}

      {diff.reps !== 0 && (
        <TargetDiffPill value={diff.reps}>
          {t("workout.previous_performance.diff.reps", {
            value: sign(diff.reps),
            noun: pluralize({
              value: Math.abs(diff.reps),
              singular: t("workout.previous_performance.diff.reps.noun.singular"),
              plural: t("workout.previous_performance.diff.reps.noun.plural"),
              genitive: t("workout.previous_performance.diff.reps.noun.genitive"),
            }),
          })}
        </TargetDiffPill>
      )}

      {diff.load !== 0 && (
        <TargetDiffPill value={diff.load}>
          {t("workout.previous_performance.diff.load", {
            value: sign(WeightFormat.kilograms(diff.load)),
          })}
        </TargetDiffPill>
      )}
    </span>
  );
}
