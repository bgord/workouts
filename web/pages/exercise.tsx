import * as bg from "@bgord/ui";
import { useCanGoBack, useRouter } from "@tanstack/react-router";
import * as ui from "../components";
import { exerciseRoute } from "../router";
import { ExerciseCategories } from "../sections/exercise-categories";
import { ExerciseDelete } from "../sections/exercise-delete";
import { ExerciseDescription } from "../sections/exercise-description";
import { ExerciseImageChange } from "../sections/exercise-image-change";
import { ExerciseLaterality } from "../sections/exercise-laterality";
import { ExerciseLoadStep } from "../sections/exercise-load-step";
import { ExerciseName } from "../sections/exercise-name";
import { ExercisePerformanceHistory } from "../sections/exercise-performance-history";
import { ExercisePerformancesEmpty } from "../sections/exercise-performances-empty";
import { ExerciseResistance } from "../sections/exercise-resistance";

export function Exercise() {
  const { exercise } = exerciseRoute.useLoaderData();
  const router = useRouter();
  const canGoBack = useCanGoBack();

  const exerciseNameUpdate = bg.useToggle({ name: "exercise-name-update" });

  return (
    <ui.Main>
      <div data-cross="center" data-stack="x" {...ui.Gap.related}>
        <ui.ButtonBack
          onClick={(event) => {
            if (!canGoBack) return;
            event.preventDefault();
            router.history.back();
          }}
          to="/catalog"
        />

        <ExerciseName {...exerciseNameUpdate} />

        {exercise.actions.delete.available && exerciseNameUpdate.off && (
          <bg.Menu name="exercise-menu">
            <ui.MenuTrigger />

            <bg.MenuContent>
              <ExerciseDelete />
            </bg.MenuContent>
          </bg.Menu>
        )}
      </div>

      <div data-cross="start" data-stack="x" data-wrap="wrap" {...ui.Gap.section}>
        <div data-md-grow="1" data-minw="0" style={{ flexBasis: 320 }}>
          <ExerciseImageChange />
        </div>

        <div data-grow="1" data-stack="y" {...bg.Rhythm(280).times(1).style.width} {...ui.Gap.block}>
          <ExerciseCategories />

          <div data-stack="x" {...ui.Gap.block}>
            <div data-basis="0" data-grow="1">
              <ExerciseResistance />
            </div>

            <div data-basis="0" data-grow="1">
              <ExerciseLaterality />
            </div>
          </div>

          <ExerciseLoadStep />

          <ExerciseDescription />
        </div>
      </div>

      <ExercisePerformancesEmpty />

      <ExercisePerformanceHistory />
    </ui.Main>
  );
}
