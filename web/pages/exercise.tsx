// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import { Form } from "../../app/services/exercise-catalog-filters-form";
import * as ui from "../components";
import { exerciseRoute } from "../router";
import * as Sections from "../sections";

export function Exercise() {
  const t = bg.useTranslations();
  const { exercise, performances } = exerciseRoute.useLoaderData();

  return (
    <ui.Main>
      <div data-stack="y" {...ui.Gap.related}>
        <div data-cross="center" data-stack="x" data-wrap="nowrap" {...ui.Gap.related}>
          <ui.ButtonBack search={Form.default} to="/catalog" />

          <Sections.ExerciseName />

          <Sections.ExerciseDelete />
        </div>

        {exercise.actions.delete.hints.length > 0 && (
          <div data-disp="none" data-md-disp="block">
            <ui.ActionHint {...exercise.actions.delete} />
          </div>
        )}
      </div>

      <div data-cross="start" data-stack="x" data-wrap="wrap" {...ui.Gap.section}>
        <div data-md-grow="1" style={{ flexBasis: 320, minWidth: 0 }}>
          <Sections.ExerciseImageChange />
        </div>

        <div data-grow="1" data-stack="y" {...bg.Rhythm(280).times(1).style.width} {...ui.Gap.block}>
          {exercise.actions.categoryAssign.available ? (
            <Sections.ExerciseCategories exercise={exercise} />
          ) : (
            <div data-stack="y" {...ui.Gap.cluster}>
              <ui.Eyebrow>{t("exercise.categories.header")}</ui.Eyebrow>

              <ul data-stack="x" data-wrap="wrap" {...ui.Gap.cluster}>
                {exercise.data.categories.map((category) => (
                  <li key={category.id}>
                    <ui.ChipLink search={{ category: category.id, name: Form.default.name }} to="/catalog">
                      {category.name}
                    </ui.ChipLink>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Sections.ExerciseDescription />
        </div>
      </div>

      <Sections.ExercisePerformancesEmpty />

      {performances.length > 0 && (
        <div data-stack="y" {...ui.Gap.section}>
          <Sections.ExerciseStats performances={performances} />

          <Sections.ExerciseProgressChart performances={performances} />

          <div data-stack="y" {...ui.Gap.related}>
            <ui.SectionHeading>{t("statistics.exercise.history")}</ui.SectionHeading>

            <Sections.ExerciseHistory performances={performances} />
          </div>
        </div>
      )}
    </ui.Main>
  );
}
