import * as bg from "@bgord/ui";
import { SearchX } from "lucide-react";
import type { ExerciseWithCategories } from "../../modules/exercises/value-objects/exercise-with-categories";
import * as ui from "../components";

export function ExerciseCatalogEmpty(props: { matching: Array<ExerciseWithCategories> }) {
  const t = bg.useTranslations();

  if (props.matching.length > 0) return null;

  return (
    <ui.EmptyState>
      <ui.EmptyStateIcon icon={SearchX} />

      <ui.EmptyStateMessage>{t("exercise.catalog.no_matches")}</ui.EmptyStateMessage>

      <small>{t("exercise.catalog.no_matches.hint")}</small>
    </ui.EmptyState>
  );
}
