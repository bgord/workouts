import * as bg from "@bgord/ui";
import * as ui from "../components";
import { exerciseRoute } from "../router";

export function ExerciseResistance() {
  const t = bg.useTranslations();
  const { exercise } = exerciseRoute.useLoaderData();

  return (
    <div data-stack="y" {...ui.Gap.cluster}>
      <h3>{t("exercise.resistance.label")}</h3>

      <p>{t(`exercise.resistance.${exercise.data.resistance}`)}</p>
    </div>
  );
}
