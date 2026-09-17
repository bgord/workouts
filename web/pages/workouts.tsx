// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import * as ui from "../components";
import * as Sections from "../sections";

export function Workouts() {
  const t = bg.useTranslations();

  return (
    <ui.Main>
      <div data-cross="center" data-stack="x" {...ui.Gap.related}>
        <ui.Header data-grow="1">{t("workout.list.header")}</ui.Header>

        <Sections.WorkoutCreate />
      </div>

      <Sections.WorkoutHistory />
    </ui.Main>
  );
}
