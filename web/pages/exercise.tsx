// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, Dumbbell } from "lucide-react";
import { Form } from "../../app/services/exercise-catalog-filters-form";
import { ActionHint, ExerciseImage, ExerciseImageSize, Main } from "../components";
import { exerciseRoute } from "../router";
import {
  ExerciseCategories,
  ExerciseDelete,
  ExerciseDescriptionUpdate,
  ExerciseHistory,
  ExerciseImageChange,
  ExerciseNameUpdate,
  ExerciseProgressChart,
  ExerciseStats,
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
      <div data-gap="0-5" data-stack="y">
        <div data-cross="center" data-gap="2" data-stack="x" data-wrap="nowrap">
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
            <h1
              data-color="neutral-0"
              data-fs="2xl"
              data-fw="black"
              data-grow="1"
              data-md-fs="xl"
              data-transform="truncate"
            >
              {exercise.data.name}
            </h1>
          )}

          {exercise.actions.delete.available && (
            <ExerciseDelete action={exercise.actions.delete} exercise={exercise.data} />
          )}
        </div>

        {exercise.actions.delete.available && (
          <ActionHint action={exercise.actions.delete} data-md-ml="0" data-md-mt="3" data-ml="auto" />
        )}
      </div>

      <div
        className="c-card"
        data-cross="start"
        data-gap="5"
        data-md-p="2-5"
        data-stack="x"
        data-variant="flat"
        data-wrap="wrap"
      >
        {exercise.actions.imageChange.enabled ? (
          <ExerciseImageChange exercise={exercise.data} />
        ) : (
          <ExerciseImage size={ExerciseImageSize.lg} {...exercise.data} />
        )}

        <div data-gap="5" data-grow="1" data-stack="y" {...bg.Rhythm(280).times(1).style.width}>
          {exercise.actions.categoryAssign.available ? (
            <ExerciseCategories exercise={exercise} />
          ) : (
            <div data-gap="2" data-stack="y">
              <div data-color="neutral-500" data-fs="xs" data-ls="wide" data-transform="uppercase">
                {t("exercise.categories.header")}
              </div>

              <ul data-gap="1-5" data-stack="x" data-wrap="wrap">
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
            </div>
          )}

          <div data-gap="2" data-stack="y">
            <div data-color="neutral-500" data-fs="xs" data-ls="wide" data-transform="uppercase">
              {t("exercise.add.description.label")}
            </div>

            {exercise.actions.update.enabled ? (
              <ExerciseDescriptionUpdate exercise={exercise.data} />
            ) : (
              <p className="c-prose" data-color="neutral-200">
                {exercise.data.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {performances.length === 0 && (
        <div
          className="c-card"
          data-cross="center"
          data-gap="1"
          data-py="8"
          data-stack="y"
          data-variant="flat"
        >
          <Dumbbell data-color="neutral-600" data-size="md" />

          <div data-color="neutral-300" data-fs="sm" data-mt="2">
            {t("statistics.exercise.history.empty")}
          </div>

          <div data-color="neutral-500" data-fs="xs">
            {t("statistics.exercise.history.empty.hint")}
          </div>
        </div>
      )}

      {performances.length > 0 && (
        <div data-gap="6" data-stack="y">
          <ExerciseStats performances={performances} />

          <ExerciseProgressChart performances={performances} />

          <div data-gap="3" data-stack="y">
            <div className="c-card-title" data-grow="1">
              {t("statistics.exercise.history")}
            </div>

            <ExerciseHistory performances={performances} />
          </div>
        </div>
      )}
    </Main>
  );
}
