// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, Dumbbell } from "lucide-react";
import { Form } from "../../app/services/exercise-catalog-filters-form";
import {
  ActionHint,
  ChipLink,
  ExerciseImage,
  ExerciseImageSize,
  Eyebrow,
  Main,
  Meta,
  SectionHeading,
} from "../components";
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

const title = { flexBasis: 0, minWidth: 0, ...bg.Rhythm().times(3).minHeight };
const image = { flexBasis: 320, minWidth: 0 };

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
      <div data-gap="3" data-stack="y">
        <div data-cross="center" data-gap="3" data-stack="x" data-wrap="nowrap">
          <Link
            aria-label={t("app.back")}
            className="c-button"
            data-interaction="subtle-scale"
            data-self="start"
            data-shrink="0"
            data-variant="icon"
            search={Form.default}
            title={t("app.back")}
            to="/catalog"
          >
            <ChevronLeft data-size="md" />
          </Link>

          <div data-cross="center" data-gap="2" data-grow="1" data-stack="x" data-wrap="nowrap" style={title}>
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
          </div>

          {exercise.actions.delete.available && (
            <div data-cross="center" data-gap="2" data-shrink="0" data-stack="x" data-wrap="nowrap">
              <div data-md-disp="none">
                <ActionHint {...exercise.actions.delete} />
              </div>

              <ExerciseDelete action={exercise.actions.delete} exercise={exercise.data} />
            </div>
          )}
        </div>

        {exercise.actions.delete.hints.length > 0 && (
          <div data-disp="none" data-md-disp="block">
            <ActionHint {...exercise.actions.delete} />
          </div>
        )}
      </div>

      <div data-cross="start" data-gap="6" data-md-px="0" data-px="4" data-stack="x" data-wrap="wrap">
        <div data-md-grow="1" style={image}>
          {exercise.actions.imageChange.enabled ? (
            <ExerciseImageChange exercise={exercise.data} />
          ) : (
            <ExerciseImage size={ExerciseImageSize.lg} {...exercise.data} />
          )}
        </div>

        <div data-gap="4" data-grow="1" data-stack="y" {...bg.Rhythm(280).times(1).style.width}>
          {exercise.actions.categoryAssign.available ? (
            <ExerciseCategories exercise={exercise} />
          ) : (
            <div data-gap="2" data-stack="y">
              <Eyebrow>{t("exercise.categories.header")}</Eyebrow>

              <ul data-gap="2" data-stack="x" data-wrap="wrap">
                {exercise.data.categories.map((category) => (
                  <li key={category.id}>
                    <ChipLink search={{ category: category.id, name: Form.default.name }} to="/catalog">
                      {category.name}
                    </ChipLink>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div data-gap="2" data-stack="y">
            <Eyebrow>{t("exercise.add.description.label")}</Eyebrow>

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
          data-md-mx="0"
          data-mx="4"
          data-py="8"
          data-stack="y"
          data-variant="flat"
        >
          <Dumbbell data-color="neutral-600" data-size="md" />

          <div data-color="neutral-300" data-fs="sm" data-mt="2">
            {t("statistics.exercise.history.empty")}
          </div>

          <Meta>{t("statistics.exercise.history.empty.hint")}</Meta>
        </div>
      )}

      {performances.length > 0 && (
        <div data-gap="6" data-md-px="0" data-px="4" data-stack="y">
          <ExerciseStats performances={performances} />

          <ExerciseProgressChart performances={performances} />

          <div data-gap="3" data-stack="y">
            <SectionHeading>{t("statistics.exercise.history")}</SectionHeading>

            <ExerciseHistory performances={performances} />
          </div>
        </div>
      )}
    </Main>
  );
}
