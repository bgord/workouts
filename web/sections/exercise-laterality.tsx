import * as bg from "@bgord/ui";
import * as ui from "../components";
import { exerciseRoute } from "../router";

export function ExerciseLaterality() {
  const t = bg.useTranslations();
  const { exercise } = exerciseRoute.useLoaderData();

  return (
    <div data-stack="y" {...ui.Gap.cluster}>
      <h3>{t("exercise.laterality.label")}</h3>

      <p>{t(`exercise.laterality.${exercise.data.laterality}`)}</p>
    </div>
  );
}
