import { useTranslations } from "@bgord/ui";
import { Trophy } from "lucide-react";

const GRAMS_IN_KILOGRAM = 1000;

export function ExerciseOneRepMaxEstimate(props: { estimate: number | null }) {
  const t = useTranslations();

  if (!props.estimate) return null;

  return (
    <div className="c-card" data-cross="center" data-gap="3" data-mr="auto" data-stack="x">
      <Trophy data-color="brand-500" data-size="lg" />

      <div data-gap="0" data-stack="y">
        <div data-color="neutral-400" data-fs="xs" data-fw="medium">
          {t("statistics.exercise.one_rep_max_estimate")}
        </div>

        <div data-color="neutral-0" data-fs="xl" data-fw="bold">
          {t("statistics.exercise.one_rep_max_estimate.value", {
            load: props.estimate / GRAMS_IN_KILOGRAM,
          })}
        </div>
      </div>
    </div>
  );
}
