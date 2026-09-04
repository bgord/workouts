// fallow-ignore-file unused-export

import { useTranslations } from "@bgord/ui";
import { Main } from "../components";
import { ExerciseCatalog } from "../sections/exercise-catalog";

export function Catalog() {
  const t = useTranslations();

  return (
    <Main>
      <h1 data-fs="lg">{t("exercise.catalog.header")}</h1>

      <ExerciseCatalog />
    </Main>
  );
}
