// fallow-ignore-file unused-export

import { useTranslations } from "@bgord/ui";
import { Main } from "../components";
import { ExerciseCatalog } from "../sections/exercise-catalog";

export function Catalog() {
  const t = useTranslations();

  return (
    <Main>
      <h1 data-color="neutral-0" data-fs="2xl" data-fw="black" data-md-fs="xl">{t("exercise.catalog.header")}</h1>

      <ExerciseCatalog />
    </Main>
  );
}
