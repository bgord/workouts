// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import { Dumbbell } from "lucide-react";
import { Form } from "../../app/services/exercise-catalog-filters-form";
import * as ui from "../components";
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
      <ui.Main>
        <ui.LinkBack search={Form.default} to="/catalog" />

        <div data-color="neutral-400">{t("exercise.not_found")}</div>
      </ui.Main>
    );
  }

  return (
    <ui.Main>
      <div data-gap="3" data-stack="y">
        <div data-cross="center" data-gap="3" data-stack="x" data-wrap="nowrap">
          <ui.ButtonBack search={Form.default} to="/catalog" />

          <div data-cross="center" data-gap="2" data-grow="1" data-stack="x" data-wrap="nowrap" style={title}>
            {exercise.actions.update.enabled ? (
              <ExerciseNameUpdate exercise={exercise.data} />
            ) : (
              <ui.Header data-grow="1">{exercise.data.name}</ui.Header>
            )}
          </div>

          {exercise.actions.delete.available && (
            <div data-cross="center" data-gap="2" data-shrink="0" data-stack="x" data-wrap="nowrap">
              <div data-md-disp="none">
                <ui.ActionHint {...exercise.actions.delete} />
              </div>

              <ExerciseDelete action={exercise.actions.delete} exercise={exercise.data} />
            </div>
          )}
        </div>

        {exercise.actions.delete.hints.length > 0 && (
          <div data-disp="none" data-md-disp="block">
            <ui.ActionHint {...exercise.actions.delete} />
          </div>
        )}
      </div>

      <div data-cross="start" data-gap="6" data-md-px="0" data-px="4" data-stack="x" data-wrap="wrap">
        <div data-md-grow="1" style={image}>
          {exercise.actions.imageChange.enabled ? (
            <ExerciseImageChange exercise={exercise.data} />
          ) : (
            <ui.ExerciseImage size={ui.ExerciseImageSize.lg} {...exercise.data} />
          )}
        </div>

        <div data-gap="4" data-grow="1" data-stack="y" {...bg.Rhythm(280).times(1).style.width}>
          {exercise.actions.categoryAssign.available ? (
            <ExerciseCategories exercise={exercise} />
          ) : (
            <div data-gap="2" data-stack="y">
              <ui.Eyebrow>{t("exercise.categories.header")}</ui.Eyebrow>

              <ul data-gap="2" data-stack="x" data-wrap="wrap">
                {exercise.data.categories.map((category) => (
                  <li key={category.id}>
                    <ui.ChipLink search={{ category: category.id, name: Form.default.name }} to="/catalog">
                      {category.name}
                    </ui.ChipLink>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div data-gap="2" data-stack="y">
            <ui.Eyebrow>{t("exercise.add.description.label")}</ui.Eyebrow>

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
        <ui.EmptyState data-md-mx="0" data-mx="4">
          <ui.EmptyStateIcon icon={Dumbbell} />

          <ui.EmptyStateMessage>{t("statistics.exercise.history.empty")}</ui.EmptyStateMessage>

          <ui.Meta>{t("statistics.exercise.history.empty.hint")}</ui.Meta>
        </ui.EmptyState>
      )}

      {performances.length > 0 && (
        <div data-gap="6" data-md-px="0" data-px="4" data-stack="y">
          <ExerciseStats performances={performances} />

          <ExerciseProgressChart performances={performances} />

          <div data-gap="3" data-stack="y">
            <ui.SectionHeading>{t("statistics.exercise.history")}</ui.SectionHeading>

            <ExerciseHistory performances={performances} />
          </div>
        </div>
      )}
    </ui.Main>
  );
}
