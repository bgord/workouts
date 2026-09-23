import * as bg from "@bgord/ui";
import { Search, X } from "lucide-react";
import { useRef } from "react";
import * as ExerciseCatalogFiltersForm from "../../app/services/exercise-catalog-filters-form";
import type { ExerciseWithCategories } from "../../modules/exercises/value-objects/exercise-with-categories";
import * as ui from "../components";
import { catalogRoute } from "../router";
import * as ShortcutDefinitions from "../services/shortcuts";

export function ExerciseCatalogFilters(props: { matching: Array<ExerciseWithCategories> }) {
  const t = bg.useTranslations();
  const { exercises, exerciseCategories } = catalogRoute.useLoaderData();
  const navigate = catalogRoute.useNavigate();
  const search = catalogRoute.useSearch();

  const all = bg.useToggle({ name: "exercise-catalog-categories" });

  const nameInput = useRef<HTMLInputElement>(null);

  const visible = all.on ? exerciseCategories.data : exerciseCategories.data.slice(0, 5);

  const hidden = exerciseCategories.data.length - visible.length;

  bg.useShortcuts({
    [ShortcutDefinitions.SearchExercises.trigger]: (event) => {
      event.preventDefault();
      nameInput.current?.focus();
    },
  });

  const pristine = ExerciseCatalogFiltersForm.Form.isDefault(search);

  return (
    <>
      <div data-cross="center" data-stack="x" {...ui.Gap.cluster}>
        <div data-cross="center" data-md-grow="1" data-position="relative" data-stack="x">
          <Search data-color="neutral-500" data-left="2-5" data-position="absolute" data-size="sm" />

          <input
            className="c-input"
            data-pl="8"
            data-width="100%"
            id={ExerciseCatalogFiltersForm.Form.name.field.name}
            name={ExerciseCatalogFiltersForm.Form.name.field.name}
            onChange={(event) =>
              navigate({
                replace: true,
                search: { category: search.category, name: event.currentTarget.value || undefined },
                to: "/catalog",
              })
            }
            placeholder={t("exercise.catalog.name.placeholder")}
            ref={nameInput}
            value={search.name ?? ""}
            {...bg.Autocomplete.off}
          />
        </div>

        <ui.Eyebrow
          data-shrink="0"
          data-transform="font-variant-numeric"
          {...bg.Rhythm(64).times(1).style.minWidth}
        >
          {t("exercise.catalog.count", { matching: props.matching.length, total: exercises.data.length })}
        </ui.Eyebrow>

        <ui.IconButton
          aria-label={t("app.clear")}
          data-disp={pristine ? "none" : undefined}
          data-md-disp={pristine ? "flex" : undefined}
          disabled={pristine}
          onClick={() => navigate({ search: ExerciseCatalogFiltersForm.Form.default, to: "/catalog" })}
          title={t("app.clear")}
        >
          <X data-size="sm" />
        </ui.IconButton>
      </div>

      <ul data-stack="x" data-wrap="wrap" {...ui.Gap.cluster}>
        {visible.map((category) => (
          <li key={category.id}>
            <ui.ChipButton
              onClick={() =>
                navigate({
                  search: {
                    category: search.category === category.id ? undefined : category.id,
                    name: search.name,
                  },
                  to: "/catalog",
                })
              }
              pressed={search.category === category.id}
            >
              {category.name}
            </ui.ChipButton>
          </li>
        ))}

        {(hidden > 0 || all.on) && (
          <li>
            <ui.ShowMoreLink
              less={t("exercise.catalog.categories.less")}
              more={t("exercise.catalog.categories.more", { count: hidden })}
              {...all}
            />
          </li>
        )}
      </ul>
    </>
  );
}
