import * as bg from "@bgord/ui";
import { Plus } from "lucide-react";
import { useRef } from "react";
import * as ExerciseCatalogFiltersForm from "../../app/services/exercise-catalog-filters-form";
import { ActionHint, ExerciseCard } from "../components";
import { catalogRoute } from "../router";
import * as ShortcutDefinitions from "../services/shortcuts";
import { ExerciseCategoryAdd } from "./exercise-category-add";

export function ExerciseCatalog() {
  const t = bg.useTranslations();
  const { exercises, exerciseCategories } = catalogRoute.useLoaderData();
  const navigate = catalogRoute.useNavigate();
  const search = catalogRoute.useSearch();

  const categoryAdd = bg.useToggle({ name: "exercise-category-add" });

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
      <div data-cross="center" data-gap="3" data-stack="x">
        <input
          className="c-input"
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
          value={name.input.props.value}
          {...bg.Autocomplete.off}
          {...bg.Rhythm().times(20).style.width}
        />

        <div data-color="neutral-400" data-fs="sm">
          {t("exercise.catalog.count", { matching: matching.length, total: exercises.data.length })}
        </div>

        {!ExerciseCatalogFiltersForm.Form.isDefault(search) && (
          <button
            className="c-button"
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

      <div data-cross="center" data-gap="3" data-stack="x">
        <ul data-gap="1" data-stack="x">
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

        {exerciseCategories.actions.add.available && (
          <>
            <ActionHint action={exerciseCategories.actions.add} />

            <button
              className="c-button"
              data-variant="secondary"
              disabled={!exerciseCategories.actions.add.enabled}
              onClick={categoryAdd.toggle}
              type="button"
            >
              <Plus data-size="sm" />
              {t("exercise.category.add.cta")}
            </button>
          </>
        )}
      </div>

      {exerciseCategories.actions.add.enabled && categoryAdd.on && <ExerciseCategoryAdd />}

      {matching.length === 0 && <div data-color="neutral-400">{t("exercise.catalog.no_matches")}</div>}

      <ul data-gap="4" data-stack="x">
        {matching.map((exercise) => (
          <ExerciseCard exercise={exercise} key={exercise.id} />
        ))}
      </ul>
    </div>
  );
}
