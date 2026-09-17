import * as bg from "@bgord/ui";
import { ChevronDown, ChevronUp, Search, SearchX, X } from "lucide-react";
import { useRef } from "react";
import * as ExerciseCatalogFiltersForm from "../../app/services/exercise-catalog-filters-form";
import * as ui from "../components";
import { catalogRoute } from "../router";
import * as ShortcutDefinitions from "../services/shortcuts";

export function ExerciseCatalog() {
  const t = bg.useTranslations();
  const { exercises, exerciseCategories } = catalogRoute.useLoaderData();
  const navigate = catalogRoute.useNavigate();
  const search = catalogRoute.useSearch();

  const categoryList = bg.useToggle({ name: "exercise-catalog-categories" });

  const nameInput = useRef<HTMLInputElement>(null);

  const name = bg.useTextField({
    name: ExerciseCatalogFiltersForm.Form.name.field.name,
    defaultValue: search.name ?? "",
  });

  const categories = categoryList.on ? exerciseCategories.data : exerciseCategories.data.slice(0, 5);

  const hidden = exerciseCategories.data.length - categories.length;

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

  const pristine = ExerciseCatalogFiltersForm.Form.isDefault(search);

  return (
    <div data-stack="y" {...ui.Spacing.block}>
      <div data-cross="center" data-stack="x" data-wrap="nowrap" {...ui.Spacing.cluster}>
        <div data-cross="center" data-md-grow="1" data-position="relative" data-stack="x">
          <Search data-color="neutral-500" data-left="2-5" data-position="absolute" data-size="sm" />

          <input
            className="c-input"
            data-pl="8"
            data-variant="transparent"
            data-width="100%"
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
          />
        </div>

        <ui.Eyebrow
          data-shrink="0"
          data-transform="font-variant-numeric"
          {...bg.Rhythm(64).times(1).style.minWidth}
        >
          {t("exercise.catalog.count", { matching: matching.length, total: exercises.data.length })}
        </ui.Eyebrow>

        <ui.IconButton
          aria-label={t("app.clear")}
          data-disp={pristine ? "none" : undefined}
          data-md-disp={pristine ? "flex" : undefined}
          disabled={pristine}
          onClick={() => {
            name.clear();
            navigate({ search: ExerciseCatalogFiltersForm.Form.default, to: "/catalog" });
          }}
          title={t("app.clear")}
        >
          <X data-size="sm" />
        </ui.IconButton>
      </div>

      <ul data-stack="x" data-wrap="wrap" {...ui.Spacing.cluster}>
        {categories.map((category) => {
          const selected = search.category === category.id;

          return (
            <li key={category.id}>
              <ui.ChipButton
                onClick={() =>
                  navigate({
                    search: { category: selected ? undefined : category.id, name: search.name },
                    to: "/catalog",
                  })
                }
                pressed={selected}
              >
                {category.name}
              </ui.ChipButton>
            </li>
          );
        })}

        {(hidden > 0 || categoryList.on) && (
          <li>
            <ui.TextLink onClick={categoryList.toggle}>
              {categoryList.on ? (
                <>
                  {t("exercise.catalog.categories.less")}
                  <ChevronUp data-size="xs" />
                </>
              ) : (
                <>
                  {t("exercise.catalog.categories.more", { count: hidden })}
                  <ChevronDown data-size="xs" />
                </>
              )}
            </ui.TextLink>
          </li>
        )}
      </ul>

      {matching.length === 0 && (
        <ui.EmptyState>
          <ui.EmptyStateIcon icon={SearchX} />

          <ui.EmptyStateMessage>{t("exercise.catalog.no_matches")}</ui.EmptyStateMessage>

          <ui.Meta>{t("exercise.catalog.no_matches.hint")}</ui.Meta>
        </ui.EmptyState>
      )}

      <ul data-md-main="center" data-stack="x" data-wrap="wrap" {...ui.Spacing.grid}>
        {matching.map((exercise) => (
          <ui.ExerciseCard key={exercise.id} {...exercise} />
        ))}
      </ul>
    </div>
  );
}
