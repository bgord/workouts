import * as bg from "@bgord/ui";
import * as ExerciseCatalogFiltersForm from "../../app/services/exercise-catalog-filters-form";
import type { ExerciseWithCategories } from "../../modules/exercises/value-objects/exercise-with-categories";
import { ExerciseCard } from "../components";
import { catalogRoute } from "../router";

function matches(exercise: ExerciseWithCategories, search: { category: string; name: string }): boolean {
  const byCategory =
    !search.category || exercise.categories.some((category) => category.id === search.category);

  const byName = exercise.name.toLowerCase().includes(search.name.trim().toLowerCase());

  return byCategory && byName;
}

export function ExerciseCatalog() {
  const t = bg.useTranslations();
  const { exercises, exerciseCategories } = catalogRoute.useLoaderData();
  const navigate = catalogRoute.useNavigate();
  const search = catalogRoute.useSearch();

  const name = bg.useTextField({
    name: ExerciseCatalogFiltersForm.Form.name.field.name,
    defaultValue: search.name,
  });

  const matching = exercises.filter((exercise) => matches(exercise, search));

  return (
    <div data-gap="5" data-stack="y">
      <div data-cross="center" data-gap="3" data-stack="x">
        <input
          className="c-input"
          id={ExerciseCatalogFiltersForm.Form.name.field.name}
          name={ExerciseCatalogFiltersForm.Form.name.field.name}
          onChange={(event) => {
            name.handleChange(event);

            navigate({
              replace: true,
              search: { category: search.category, name: event.currentTarget.value },
              to: "/catalog",
            });
          }}
          placeholder={t("exercise.catalog.name.placeholder")}
          value={name.input.props.value}
          {...bg.Autocomplete.off}
          {...bg.Rhythm().times(20).style.width}
        />

        <div data-color="neutral-500" data-fs="sm">
          {t("exercise.catalog.count", { matching: matching.length, total: exercises.length })}
        </div>

        {!ExerciseCatalogFiltersForm.Form.isDefault(search) && (
          <button
            className="c-button"
            data-variant="bare"
            onClick={() => {
              name.clear();

              navigate({ search: ExerciseCatalogFiltersForm.Form.default, to: "/catalog" });
            }}
            type="button"
          >
            {t("app.clear")}
          </button>
        )}
      </div>

      <ul data-gap="1" data-stack="x">
        {exerciseCategories.map((category) => {
          const selected = search.category === category.id;

          return (
            <li key={category.id}>
              <button
                aria-pressed={selected}
                className="c-badge"
                data-bc={selected ? "brand-400" : "neutral-400"}
                data-bg={selected ? "brand-400" : "neutral-950"}
                data-color={selected ? "neutral-950" : "neutral-300"}
                data-cursor="pointer"
                data-variant="outline"
                onClick={() =>
                  navigate({
                    search: { category: selected ? "" : category.id, name: search.name },
                    to: "/catalog",
                  })
                }
                type="button"
              >
                {category.name}
              </button>
            </li>
          );
        })}
      </ul>

      {matching.length === 0 && <div data-color="neutral-500">{t("exercise.catalog.no_matches")}</div>}

      <ul data-gap="4" data-stack="x">
        {matching.map((exercise) => (
          <ExerciseCard exercise={exercise} key={exercise.id} />
        ))}
      </ul>
    </div>
  );
}
