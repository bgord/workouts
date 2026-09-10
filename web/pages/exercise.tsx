// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Form } from "../../app/services/exercise-catalog-filters-form";
import { ExerciseImage, ExerciseImageSize, Main } from "../components";
import { exerciseRoute } from "../router";
import {
  ExerciseCategories,
  ExerciseDelete,
  ExerciseDescriptionUpdate,
  ExerciseHistory,
  ExerciseImageChange,
  ExerciseNameUpdate,
  ExerciseOneRepMaxEstimate,
  ExerciseProgressChart,
} from "../sections";

export function Exercise() {
  const t = bg.useTranslations();
  const { exercise, performances } = exerciseRoute.useLoaderData();

  if (!exercise) {
    return (
      <Main>
        <Link
          className="c-link"
          data-cross="center"
          data-gap="1"
          data-stack="x"
          search={Form.default}
          to="/catalog"
        >
          <ChevronLeft data-size="sm" />
          {t("app.back")}
        </Link>

        <div data-color="neutral-400">{t("exercise.not_found")}</div>
      </Main>
    );
  }

  return (
    <Main>
      <div data-gap="4" data-stack="y">
        <div data-cross="center" data-gap="2" data-stack="x">
          <Link
            aria-label={t("app.back")}
            className="c-button"
            data-interaction="subtle-scale"
            data-self="start"
            data-variant="icon"
            search={Form.default}
            title={t("app.back")}
            to="/catalog"
          >
            <ChevronLeft data-size="md" />
          </Link>

          {exercise.actions.update.enabled ? (
            <ExerciseNameUpdate exercise={exercise.data} />
          ) : (
            <h1 data-color="neutral-0" data-fs="2xl" data-fw="black" data-grow="1" data-md-fs="xl">
              {exercise.data.name}
            </h1>
          )}

          {exercise.actions.delete.available && (
            <ExerciseDelete action={exercise.actions.delete} exercise={exercise.data} />
          )}
        </div>

        {exercise.actions.imageChange.enabled ? (
          <ExerciseImageChange exercise={exercise.data} />
        ) : (
          <ExerciseImage exercise={exercise.data} size={ExerciseImageSize.lg} />
        )}

        {exercise.actions.categoryAssign.available ? (
          <ExerciseCategories exercise={exercise} />
        ) : (
          <ul data-gap="1" data-stack="x">
            {exercise.data.categories.map((category) => (
              <li key={category.id}>
                <Link
                  className="c-badge"
                  data-variant="outline"
                  search={{ category: category.id, name: Form.default.name }}
                  to="/catalog"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {exercise.actions.update.enabled ? (
          <ExerciseDescriptionUpdate exercise={exercise.data} />
        ) : (
          <p className="c-prose" data-color="neutral-200">
            {exercise.data.description}
          </p>
        )}

        <div data-gap="8" data-mt="8" data-stack="y">
          <div data-stack="x">
            <ExerciseOneRepMaxEstimate performances={performances} />
          </div>

          <ExerciseProgressChart performances={performances} />

          <ExerciseHistory performances={performances} />
        </div>
      </div>
    </Main>
  );
}
