import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, Plus, Search } from "lucide-react";
import { Form } from "../../app/services/plan-section-exercise-instruction-add-form";
import type { ActionState } from "../../modules/action-state";
import type { Plan, PlanSectionWithExercises } from "../../modules/plans/value-objects/plan";
import {
  ActionHint,
  ButtonClear,
  Dialog,
  DialogError,
  DialogFooter,
  DialogHeader,
  ExerciseImage,
  ExerciseImageSize,
} from "../components";
import { planRoute } from "../router";

const placeholder = { ...bg.Rhythm().times(3).width, ...bg.Rhythm().times(3).height };
const shrinkable = { minHeight: 0 };
const list = { ...shrinkable, maxHeight: "40vh" };
const categories = { flexShrink: 2, maxWidth: "40%" };

export function PlanSectionExerciseInstructionAdd(props: {
  plan: Plan;
  section: PlanSectionWithExercises;
  action: ActionState;
}) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { exercises } = planRoute.useLoaderData();
  const add = bg.useToggle({ name: `plan-section-exercise-instruction-add-${props.section.id}` });

  const exerciseId = bg.useTextField(Form.exerciseId.field);
  const query = bg.useTextField(Form.query.field);
  const sets = bg.useNumberField(Form.sets.field);
  const repsMin = bg.useNumberField(Form.repsMin.field);
  const repsMax = bg.useNumberField(Form.repsMax.field);

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/plans/${props.plan.id}/section/${props.section.id}/exercise-instruction`, {
        method: "POST",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(props.plan.revision),
        body: JSON.stringify({
          exerciseId: exerciseId.value,
          sets: sets.value,
          reps: { min: repsMin.value, max: repsMax.value },
        }),
      }),
    onSuccess: async (_, context) => {
      add.disable();

      await router.invalidate({ filter: (route) => route.id === planRoute.id, sync: true });

      bg.Fields.clearAll([exerciseId, query, sets, repsMin, repsMax]);
      context.form?.reset();
    },
  });

  if (add.off) {
    return (
      <div
        data-bct="alpha-subtle"
        data-bst="solid"
        data-bwt="hairline"
        data-cross="center"
        data-gap="3"
        data-md-ml="0"
        data-ml="3"
        data-stack="x"
        data-wrap="nowrap"
      >
        <button
          data-color="neutral-400"
          data-cross="center"
          data-cursor="pointer"
          data-fs="sm"
          data-fw="medium"
          data-gap="3"
          data-grow="1"
          data-hover-color="neutral-0"
          data-py="2"
          data-stack="x"
          data-wrap="nowrap"
          disabled={!props.action.enabled}
          onClick={add.enable}
          type="button"
          {...add.props.controller}
        >
          <div aria-hidden data-color="neutral-600" data-fs="xs" data-transform="font-variant-numeric">
            {props.section.exerciseInstructions.length + 1}
          </div>

          <div
            data-bc="neutral-700"
            data-br="sm"
            data-bs="dashed"
            data-bw="hairline"
            data-color="neutral-500"
            data-cross="center"
            data-main="center"
            data-shrink="0"
            data-stack="x"
            style={placeholder}
          >
            <Plus data-size="sm" />
          </div>

          {t("plan.section.exercise.add.cta")}
        </button>

        <ActionHint action={props.action} data-shrink="0" />
      </div>
    );
  }

  const matching = exercises.data.filter((exercise) =>
    exercise.name.toLowerCase().includes((query.value ?? "").trim().toLowerCase()),
  );

  const clear = bg.exec([
    exerciseId.clear,
    query.clear,
    sets.clear,
    repsMin.clear,
    repsMax.clear,
    mutation.reset,
  ]);

  return (
    <>
      <div
        data-bct="alpha-subtle"
        data-bst="solid"
        data-bwt="hairline"
        data-cross="center"
        data-gap="3"
        data-stack="x"
        data-wrap="nowrap"
      >
        <button
          data-color="neutral-400"
          data-cross="center"
          data-cursor="pointer"
          data-fs="sm"
          data-fw="medium"
          data-gap="3"
          data-grow="1"
          data-hover-color="neutral-0"
          data-py="2"
          data-stack="x"
          data-wrap="nowrap"
          disabled={!props.action.enabled}
          onClick={add.enable}
          type="button"
          {...add.props.controller}
        >
          <div aria-hidden data-color="neutral-600" data-fs="xs" data-transform="font-variant-numeric">
            {props.section.exerciseInstructions.length + 1}
          </div>

          <div
            data-bc="neutral-700"
            data-br="sm"
            data-bs="dashed"
            data-bw="hairline"
            data-color="neutral-500"
            data-cross="center"
            data-main="center"
            data-shrink="0"
            data-stack="x"
            style={placeholder}
          >
            <Plus data-size="sm" />
          </div>

          {t("plan.section.exercise.add.cta")}
        </button>

        <ActionHint action={props.action} data-shrink="0" />
      </div>

      <Dialog {...add}>
        <DialogHeader disabled={mutation.isLoading} onClose={bg.exec([clear, add.disable])}>
          {t("plan.section.exercise.add.cta")}
          <span data-color="neutral-500" data-fw="regular" data-ml="2">
            · {props.section.name}
          </span>
        </DialogHeader>

        <form
          aria-busy={mutation.isLoading}
          data-gap="6"
          data-stack="y"
          data-wrap="nowrap"
          onSubmit={mutation.handleSubmit}
          style={shrinkable}
        >
          <div data-gap="2" data-stack="y" data-wrap="nowrap" style={shrinkable}>
            <div data-cross="center" data-position="relative" data-stack="x">
              <Search data-color="neutral-500" data-left="2-5" data-position="absolute" data-size="sm" />

              <input
                aria-label={t("plan.section.exercise.add.exercise.label")}
                className="c-input"
                data-pl="8"
                data-variant="transparent"
                data-width="100%"
                placeholder={t("plan.section.exercise.add.search.placeholder")}
                type="search"
                {...query.input.props}
              />
            </div>

            <ul
              aria-label={t("plan.section.exercise.add.exercise.label")}
              data-bc="neutral-800"
              data-br="md"
              data-bs="solid"
              data-bw="hairline"
              data-overflow="auto"
              data-stack="y"
              style={list}
            >
              {matching.length === 0 && (
                <li data-color="neutral-500" data-fs="sm" data-main="center" data-py="4" data-stack="x">
                  {t("plan.section.exercise.add.search.empty")}
                </li>
              )}

              {matching.map((exercise, index) => (
                <li
                  data-bct={index === 0 ? undefined : "alpha-subtle"}
                  data-bst={index === 0 ? undefined : "solid"}
                  data-bwt={index === 0 ? undefined : "hairline"}
                  key={exercise.id}
                >
                  <label
                    data-bg={exerciseId.value === exercise.id ? "alpha-subtle" : undefined}
                    data-color={exerciseId.value === exercise.id ? "neutral-0" : "neutral-200"}
                    data-cross="center"
                    data-cursor="pointer"
                    data-fs="sm"
                    data-gap="3"
                    data-hover-bg="alpha-subtle"
                    data-position="relative"
                    data-px="3"
                    data-py="2"
                    data-stack="x"
                    data-wrap="nowrap"
                  >
                    <input
                      checked={exerciseId.value === exercise.id}
                      className="c-visually-hidden"
                      name={exerciseId.input.props.name}
                      onChange={() => exerciseId.set(exercise.id)}
                      type="radio"
                      value={exercise.id}
                    />

                    <span data-shrink="0" data-stack="x">
                      <ExerciseImage size={ExerciseImageSize.xs} {...exercise} />
                    </span>

                    <span data-grow="1" data-transform="truncate" title={exercise.name}>
                      {exercise.name}
                    </span>

                    <span
                      data-color="neutral-500"
                      data-fs="xs"
                      data-md-disp="none"
                      data-transform="truncate"
                      style={categories}
                    >
                      {exercise.categories.map((category) => category.name).join(", ")}
                    </span>

                    {exerciseId.value === exercise.id && (
                      <Check data-color="brand-400" data-shrink="0" data-size="sm" />
                    )}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div data-cross="end" data-gap="4" data-stack="x" data-wrap="nowrap">
            <div data-gap="1" data-stack="y">
              <label className="c-label" {...sets.label.props}>
                {t("plan.section.exercise.add.sets.label")}
              </label>

              <input
                className="c-input"
                type="number"
                {...Form.sets.pattern}
                {...sets.input.props}
                {...bg.Rhythm().times(5).style.width}
              />
            </div>

            <div data-gap="1" data-stack="y">
              <label className="c-label" {...repsMin.label.props}>
                {t("plan.section.exercise.add.reps.label")}
              </label>

              <div data-cross="center" data-gap="2" data-stack="x" data-wrap="nowrap">
                <input
                  className="c-input"
                  type="number"
                  {...Form.repsMin.pattern}
                  {...repsMin.input.props}
                  {...bg.Rhythm().times(5).style.width}
                />

                <div data-color="neutral-400">-</div>

                <input
                  aria-label={t("plan.section.exercise.add.reps.max.label")}
                  className="c-input"
                  type="number"
                  {...Form.repsMax.pattern}
                  min={repsMin.value}
                  {...repsMax.input.props}
                  {...bg.Rhythm().times(5).style.width}
                />
              </div>
            </div>
          </div>

          {mutation.isError && <DialogError>{t("plan.section.exercise.add.error")}</DialogError>}

          <DialogFooter disabled={mutation.isLoading} onCancel={bg.exec([clear, add.disable])}>
            <ButtonClear
              disabled={
                exerciseId.empty && query.empty && sets.unchanged && repsMin.unchanged && repsMax.unchanged
              }
              onClick={clear}
            />

            <button
              className="c-button"
              data-variant="primary"
              disabled={
                exerciseId.empty || sets.empty || repsMin.empty || repsMax.empty || mutation.isLoading
              }
              type="submit"
            >
              <Plus data-size="sm" />
              {t("plan.section.exercise.add.cta")}
            </button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  );
}
