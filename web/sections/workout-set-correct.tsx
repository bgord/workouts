import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Pencil, X } from "lucide-react";
import { useRef } from "react";
import { Form } from "../../app/services/workout-target-form";
import type { LoggedSet, WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import * as ui from "../components";
import { workoutRoute } from "../router";
import { WeightFormat } from "../services/weight-format";

export function WorkoutSetCorrect(
  props: { exercise: WorkoutExercise; loggedSet: LoggedSet } & bg.UseToggleReturnType,
) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { workout } = workoutRoute.useLoaderData();
  const { toggle } = bg.extractUseToggle(props);
  const action = props.loggedSet.actions.correct;

  const reps = bg.useNumberField<number>({
    name: `corrected-reps-${props.loggedSet.id}`,
    defaultValue: props.loggedSet.reps,
  });

  const load = bg.useNumberField<number>({
    name: `corrected-load-${props.loggedSet.id}`,
    defaultValue: WeightFormat.kilograms(props.loggedSet.load),
  });

  const rir = useRef<number | undefined>(props.loggedSet.rir);

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/workouts/${workout.data.id}/exercise/${props.exercise.id}/set/${props.loggedSet.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(workout.data.revision),
        body: JSON.stringify({
          reps: reps.value,
          load: WeightFormat.grams(load.value ?? 0),
          rir: rir.current,
        }),
      }),
    onSuccess: async () => {
      toggle.disable();
      await router.invalidate({ filter: (route) => route.id === workoutRoute.id, sync: true });
    },
  });

  if (!action.available) return null;

  if (toggle.off) {
    return (
      <div data-cross="center" data-stack="x" data-wrap="nowrap" {...ui.Gap.related}>
        <ui.IconButton
          disabled={!action.enabled}
          onClick={toggle.enable}
          title={t("workout.set.correct.title", { setNumber: props.loggedSet.setNumber })}
          {...toggle.props.controller}
        >
          <Pencil data-size="sm" />
        </ui.IconButton>

        <ui.ActionHint {...action} />
      </div>
    );
  }

  const cancel = bg.exec([reps.clear, load.clear, mutation.reset, toggle.disable]);

  return (
    <form
      aria-busy={mutation.isLoading}
      data-cross="center"
      data-grow="1"
      data-stack="x"
      onSubmit={mutation.handleSubmit}
      {...ui.Gap.cluster}
      {...toggle.props.target}
    >
      <ui.Stepper
        disabled={mutation.isLoading}
        field={reps}
        label={t("workout.set.reps.label")}
        width={40}
        {...Form.reps.pattern}
      />

      <ui.Separator data-md-disp="none">×</ui.Separator>

      <ui.Stepper
        disabled={mutation.isLoading}
        field={load}
        label={t("workout.set.load.label")}
        unit="kg"
        width={52}
        {...Form.load.pattern}
      />

      <ui.RirSubmit
        disabled={reps.empty || load.empty || mutation.isLoading}
        onSelect={(value) => {
          rir.current = value;
        }}
        value={props.loggedSet.rir}
        variant="dense"
      />

      <ui.IconButton aria-label={t("app.cancel")} onClick={cancel} title={t("app.cancel")}>
        <X data-size="sm" />
      </ui.IconButton>

      {mutation.isError && <ui.Output data-width="100%">{t("workout.set.correct.error")}</ui.Output>}
    </form>
  );
}
