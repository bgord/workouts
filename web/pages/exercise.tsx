// fallow-ignore-file unused-export
import { useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Form } from "../../app/services/exercise-catalog-filters-form";
import { ExerciseImage, ExerciseImageSize, Main } from "../components";
import { exerciseRoute } from "../router";
import { ExerciseBestSet, ExerciseOneRepMaxEstimate } from "../sections";

export function Exercise() {
  const t = useTranslations();
  const { exercise, oneRepMax, bestSet } = exerciseRoute.useLoaderData();

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

          <h1 data-color="neutral-0" data-fs="2xl" data-fw="black" data-grow="1" data-md-fs="xl">
            {exercise.name}
          </h1>
        </div>

        <ExerciseImage exercise={exercise} size={ExerciseImageSize.lg} />

        <div data-gap="3" data-stack="x">
          <ExerciseOneRepMaxEstimate oneRepMax={oneRepMax} />

          <ExerciseBestSet bestSet={bestSet} />
        </div>

        <ul data-gap="1" data-stack="x">
          {exercise.categories.map((category) => (
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

        <p className="c-prose" data-color="neutral-200">
          {exercise.description}
        </p>
      </div>
    </Main>
  );
}
