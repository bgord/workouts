// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import { Form } from "../../app/services/exercise-catalog-filters-form";
import * as ui from "../components";
import { exerciseRoute } from "../router";
import { ExerciseCategories } from "../sections/exercise-categories";
import { ExerciseDelete } from "../sections/exercise-delete";
import { ExerciseDescription } from "../sections/exercise-description";
import { ExerciseImageChange } from "../sections/exercise-image-change";
import { ExerciseName } from "../sections/exercise-name";
import { ExercisePerformanceHistory } from "../sections/exercise-performance-history";
import { ExercisePerformancesEmpty } from "../sections/exercise-performances-empty";

export function Exercise() {
  const { exercise } = exerciseRoute.useLoaderData();

  return (
    <ui.Main>
      <div data-stack="y" {...ui.Gap.related}>
        <div data-stack="x" {...ui.Gap.related}>
          <ui.ButtonBack search={Form.default} to="/catalog" />

          <ExerciseName />

          <ExerciseDelete />
        </div>

        {exercise.actions.delete.hints.length > 0 && (
          <div data-disp="none" data-md-disp="block">
            <ui.ActionHint {...exercise.actions.delete} />
          </div>
        )}
      </div>

      <div data-cross="start" data-stack="x" data-wrap="wrap" {...ui.Gap.section}>
        <div data-md-grow="1" data-minw="0" style={{ flexBasis: 320 }}>
          <ExerciseImageChange />
        </div>

        <div data-grow="1" data-stack="y" {...bg.Rhythm(280).times(1).style.width} {...ui.Gap.block}>
          <ExerciseCategories />

          <ExerciseDescription />
        </div>
      </div>

      <ExercisePerformancesEmpty />

      <ExercisePerformanceHistory />
    </ui.Main>
  );
}
