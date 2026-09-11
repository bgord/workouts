import * as bg from "@bgord/ui";
import { SearchX } from "lucide-react";
import { useRef } from "react";
import * as ExerciseCatalogFiltersForm from "../../app/services/exercise-catalog-filters-form";
import { ExerciseCard } from "../components";
import { catalogRoute } from "../router";
import * as ShortcutDefinitions from "../services/shortcuts";

export function ExerciseCatalog() {
  const t = bg.useTranslations();
  const { exercises, exerciseCategories } = catalogRoute.useLoaderData();
  const navigate = catalogRoute.useNavigate();
  const search = catalogRoute.useSearch();

  const nameInput = useRef<HTMLInputElement>(null);

  const name = bg.useTextField({
    name: ExerciseCatalogFiltersForm.Form.name.field.name,
    defaultValue: search.name ?? "",
  });

  const matching = exercises.data.filter((exercise) => {
    const byCategory =
      !search.category || exercise.categories.some((category) => category.id === search.category);

    const byName = exercise.name.toLowerCase().includes((search.name ?? "").trim().toLowerCase());

    return byCategory && byName;
  });

  bg.useShortcuts({
    [ShortcutDefinitions.SearchExercises.trigger]: (event) => {
      event.preventDefault();
      nameInput.current?.focus();
    },
    [ShortcutDefinitions.OpenExercise.trigger]: () => {
      if (matching[0]) {
        navigate({ params: { exerciseId: matching[0].id }, to: "/catalog/exercise/$exerciseId" });
      }
    },
  });

  return (
    <div data-gap="5" data-stack="y">
      <div data-cross="center" data-gap="2" data-stack="x" data-wrap="wrap">
        <input
          className="c-input"
          data-md-grow="1"
          id={ExerciseCatalogFiltersForm.Form.name.field.name}
          name={ExerciseCatalogFiltersForm.Form.name.field.name}
          onChange={(event) => {
            name.handleChange(event);

            navigate({
              replace: true,
              search: { category: search.category, name: event.currentTarget.value || undefined },
              to: "/catalog",
            });
          }}
          placeholder={t("exercise.catalog.name.placeholder")}
          ref={nameInput}
          style={{ background: "transparent" }}
          value={name.input.props.value}
          {...bg.Autocomplete.off}
        />

        <div data-color="neutral-500" data-fs="sm" data-transform="font-variant-numeric">
          {t("exercise.catalog.count", { matching: matching.length, total: exercises.data.length })}
        </div>

        {!ExerciseCatalogFiltersForm.Form.isDefault(search) && (
          <button
            className="c-button"
            data-ml="auto"
            data-variant="ghost"
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

      <ul data-gap="1-5" data-stack="x" data-wrap="wrap">
        {exerciseCategories.data.map((category) => {
          const selected = search.category === category.id;

          return (
            <li key={category.id}>
              <button
                aria-pressed={selected}
                className="c-badge"
                data-cursor="pointer"
                data-variant={selected ? "primary" : "outline"}
                onClick={() =>
                  navigate({
                    search: { category: selected ? undefined : category.id, name: search.name },
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

      {matching.length === 0 && (
        <div
          className="c-card"
          data-cross="center"
          data-gap="1"
          data-py="8"
          data-stack="y"
          data-variant="flat"
        >
          <SearchX data-color="neutral-600" data-size="md" />

          <div data-color="neutral-300" data-fs="sm" data-mt="2">
            {t("exercise.catalog.no_matches")}
          </div>

          <div data-color="neutral-500" data-fs="xs">
            {t("exercise.catalog.no_matches.hint")}
          </div>
        </div>
      )}

      <ul data-gap="3" data-md-main="center" data-stack="x" data-wrap="wrap">
        {matching.map((exercise) => (
          <ExerciseCard key={exercise.id} {...exercise} />
        ))}
      </ul>
    </div>
  );
}
