import * as bg from "@bgord/ui";
import * as ui from "../components";
import { catalogRoute } from "../router";
import * as ShortcutDefinitions from "../services/shortcuts";
import { ExerciseCatalogEmpty } from "./exercise-catalog-empty";
import { ExerciseCatalogFilters } from "./exercise-catalog-filters";

export function ExerciseCatalog() {
  const { exercises } = catalogRoute.useLoaderData();
  const navigate = catalogRoute.useNavigate();
  const search = catalogRoute.useSearch();

  const matching = exercises.data.filter((exercise) => {
    const byCategory =
      !search.category || exercise.categories.some((category) => category.id === search.category);

    const byName = exercise.name.toLowerCase().includes((search.name ?? "").trim().toLowerCase());

    return byCategory && byName;
  });

  bg.useShortcuts({
    [ShortcutDefinitions.OpenExercise.trigger]: () => {
      if (matching[0]) {
        navigate({ params: { exerciseId: matching[0].id }, to: "/catalog/exercise/$exerciseId" });
      }
    },
  });

  return (
    <div data-stack="y" {...ui.Gap.block}>
      <ExerciseCatalogFilters matching={matching} />

      <ExerciseCatalogEmpty matching={matching} />

      <ul data-md-main="center" data-stack="x" data-wrap="wrap" {...ui.Gap.block}>
        {matching.map((exercise) => (
          <ui.ExerciseCard key={exercise.id} {...exercise} />
        ))}
      </ul>
    </div>
  );
}
