import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Form } from "../../app/services/plan-section-exercise-instruction-add-form";
import type { PlanSection } from "../../modules/plans/queries/get-plan";
import type { ExerciseCatalogItem } from "../../modules/plans/queries/list-exercise-catalog";
import { RepsSchemeOptions } from "../../modules/plans/value-objects/reps-scheme-options";
import * as ui from "../components";
import { useExerciseCatalog } from "../hooks/use-exercise-catalog";
import { RepsSchemeKit } from "../kits/reps-scheme.kit";
import { ResistanceKit } from "../kits/resistance.kit";
import { planRoute } from "../router";
import { ProgressionMethodChoice } from "../services/progression-method-choice";

export function PlanSectionExerciseInstructionAdd(props: PlanSection) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { plan } = planRoute.useLoaderData();
  const catalog = useExerciseCatalog();

  const planSectionExerciseInstructionAdd = bg.useToggle({
    name: `plan-section-exercise-instruction-add-${props.id}`,
  });
  const planSectionExerciseInstructionPick = bg.useToggle({
    name: `plan-section-exercise-instruction-add-pick-${props.id}`,
  });

  const exerciseId = bg.useTextField(Form.exerciseId.field);
  const query = bg.useTextField(Form.query.field);
  const sets = bg.useNumberField(Form.sets.field);
  const repsMin = bg.useNumberField(Form.repsMin.field);
  const repsMax = bg.useNumberField(Form.repsMax.field);
  const progression = bg.useTextField(Form.progression.field);
  const repsScheme = bg.useTextField(Form.repsScheme.field);
  const exercise = catalog.find(exerciseId.value);
  const scheme = repsScheme.value ?? RepsSchemeOptions.range;
  const Reps = RepsSchemeKit[scheme];

  const toggleRepsScheme = () => {
    repsScheme.set(Reps.toggled);
    RepsSchemeKit[Reps.toggled].align(repsMin, repsMax);
    progression.set(
      ProgressionMethodChoice.keep(exercise?.progressionMethods, Reps.toggled, progression.value),
    );
  };

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/plans/${plan.data.id}/section/${props.id}/exercise-instruction`, {
        method: "POST",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(plan.data.revision),
        body: JSON.stringify({
          exerciseId: exerciseId.value,
          sets: sets.value,
          reps: Reps.payload(repsMin, repsMax),
          progression: progression.value,
        }),
      }),
    onSuccess: async (_, context) => {
      planSectionExerciseInstructionAdd.disable();
      planSectionExerciseInstructionPick.disable();
      await router.invalidate({ filter: (match) => match.routeId === planRoute.id, sync: true });
      bg.Fields.clearAll([exerciseId, query, sets, repsMin, repsMax, repsScheme, progression]);
      context.form?.reset();
    },
  });

  const clear = bg.exec([
    exerciseId.clear,
    query.clear,
    sets.clear,
    repsMin.clear,
    repsMax.clear,
    repsScheme.clear,
    progression.clear,
    mutation.reset,
  ]);
  const close = bg.exec([
    clear,
    planSectionExerciseInstructionPick.disable,
    planSectionExerciseInstructionAdd.disable,
  ]);

  if (!props.actions.exerciseInstructionAdd.available) return null;

  return (
    <>
      <ui.HairlineBlock data-ml="1-5" data-stack="x" tone="subtle" {...ui.Spacing.rowCompact}>
        <ui.AddButton
          disabled={!props.actions.exerciseInstructionAdd.enabled}
          onClick={bg.exec([catalog.load, planSectionExerciseInstructionAdd.enable])}
          onFocus={catalog.load}
          onPointerEnter={catalog.load}
          {...ui.describedByHint(
            props.actions.exerciseInstructionAdd,
            `exercise-instruction-add-hint-${props.id}`,
          )}
          {...planSectionExerciseInstructionAdd.props.controller}
        >
          <ui.RowIndex aria-hidden>{props.exerciseInstructions.length + 1}</ui.RowIndex>

          <ui.AddPlaceholder />

          {t("plan.section.exercise.add.cta")}
        </ui.AddButton>

        <ui.ActionHint
          {...props.actions.exerciseInstructionAdd}
          data-shrink="0"
          id={`exercise-instruction-add-hint-${props.id}`}
        />
      </ui.HairlineBlock>

      <ui.Dialog {...planSectionExerciseInstructionAdd}>
        <ui.DialogHeader disabled={mutation.isLoading} onClose={close}>
          {t("plan.section.exercise.add.cta")}
          <small data-ml="2">· {props.name}</small>
        </ui.DialogHeader>

        {(!exercise || planSectionExerciseInstructionPick.on) && catalog.exercises && (
          <>
            <div data-minh="0" data-stack="y">
              <ui.ExercisePicker
                exercises={catalog.exercises}
                name={exerciseId.input.props.name}
                onCancel={exercise && bg.exec([query.clear, planSectionExerciseInstructionPick.disable])}
                onChange={(exercise) => {
                  exerciseId.set(exercise.id);
                  progression.set(
                    ProgressionMethodChoice.keep(exercise.progressionMethods, scheme, progression.value),
                  );
                  planSectionExerciseInstructionPick.disable();
                }}
                query={query}
                value={exerciseId.value}
              />
            </div>

            {!exercise && <ui.DialogFooter onCancel={close} />}
          </>
        )}

        {exercise && planSectionExerciseInstructionPick.off && (
          <form
            aria-busy={mutation.isLoading}
            data-minh="0"
            data-stack="y"
            onSubmit={mutation.handleSubmit}
            {...ui.Gap.section}
          >
            <PlanSectionExerciseInstructionAddExercise
              disabled={mutation.isLoading}
              exercise={exercise}
              onChange={bg.exec([catalog.load, planSectionExerciseInstructionPick.enable])}
            />

            <ui.Prescription data-cross="end">
              <div data-grow="1" data-stack="y" {...ui.Gap.field}>
                <span aria-hidden>{t("plan.section.exercise.add.sets.label")}</span>

                <ui.Stepper
                  aria-label={t("plan.section.exercise.add.sets.label")}
                  field={sets}
                  variant="fill"
                  {...Form.sets.pattern}
                />
              </div>

              <ui.Separator data-cross="center" data-stack="x" {...bg.Rhythm(34).times(1).style.height}>
                ×
              </ui.Separator>

              <div data-stack="y" style={{ flexGrow: 2 }} {...ui.Gap.field}>
                <div data-cross="center" data-main="between" data-stack="x" {...ui.Gap.cluster}>
                  <span aria-hidden>{t("plan.section.exercise.add.reps.label")}</span>

                  <ui.ChipButton onClick={toggleRepsScheme} pressed={scheme === RepsSchemeOptions.amrap}>
                    {t("plan.section.exercise.add.amrap")}
                  </ui.ChipButton>
                </div>

                <div data-cross="center" data-stack="x" {...ui.Gap.cluster}>
                  <ui.Stepper
                    aria-label={t("plan.section.exercise.add.reps.label")}
                    field={repsMin}
                    variant="fill"
                    {...Form.repsMin.pattern}
                  />

                  <Reps.Field
                    aria-label={t("plan.section.exercise.add.reps.max.label")}
                    field={repsMax}
                    {...Form.repsMax.pattern}
                    min={repsMin.value ?? Form.repsMax.pattern.min}
                  />
                </div>
              </div>
            </ui.Prescription>

            <ui.ProgressionMethodPicker
              field={progression}
              options={ProgressionMethodChoice.options(exercise.progressionMethods, scheme)}
            />

            {mutation.isError && <ui.DialogError>{t("plan.section.exercise.add.error")}</ui.DialogError>}

            <ui.DialogFooter disabled={mutation.isLoading} onCancel={close}>
              <ui.ButtonClear onClick={clear} />

              <button
                className="c-button"
                data-variant="primary"
                disabled={sets.empty || repsMin.empty || !Reps.ready(repsMax) || mutation.isLoading}
                type="submit"
              >
                <Plus data-size="sm" />
                {t("plan.section.exercise.add.cta")}
              </button>
            </ui.DialogFooter>
          </form>
        )}
      </ui.Dialog>
    </>
  );
}

function PlanSectionExerciseInstructionAddExercise(
  props: Omit<React.JSX.IntrinsicElements["button"], "onChange"> & {
    exercise: ExerciseCatalogItem;
    onChange: () => void;
  },
) {
  const t = bg.useTranslations();
  const { exercise, onChange, ...button } = props;
  const Resistance = ResistanceKit[exercise.resistance];

  return (
    <div
      data-bc="alpha-medium"
      data-br="md"
      data-bs="solid"
      data-bw="hairline"
      data-stack="x"
      {...ui.Spacing.surfaceCompact}
      {...ui.Gap.related}
    >
      <span aria-hidden data-shrink="0" data-stack="x">
        <ui.ExerciseImage size={ui.ExerciseImageSize.xs} {...exercise} />
      </span>

      <div data-grow="1" data-minw="0" data-stack="y" {...ui.Gap.inline}>
        <span data-color="neutral-100" data-fw="medium" data-transform="truncate" title={exercise.name}>
          {exercise.name}
        </span>

        <div data-color="neutral-500" data-fs="xs" data-stack="x" data-wrap="wrap" {...ui.Gap.cluster}>
          {exercise.categories.length > 0 && (
            <span>{exercise.categories.map((category) => category.name).join(", ")}</span>
          )}

          <Resistance.Badge />
        </div>
      </div>

      <button
        aria-label={t("plan.section.exercise.edit.change", { name: exercise.name })}
        className="c-button"
        data-shrink="0"
        data-variant="ghost"
        onClick={onChange}
        type="button"
        {...button}
      >
        {t("plan.section.exercise.add.change")}
      </button>
    </div>
  );
}
