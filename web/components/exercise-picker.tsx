import * as bg from "@bgord/ui";
import { Check, Search } from "lucide-react";
import { Suspense, use } from "react";
import type {
  ExerciseCatalogItem,
  ExerciseCatalogResponse,
} from "../../modules/plans/queries/list-exercise-catalog";
import { ButtonCancel } from "./button-cancel";
import { ExerciseImage, ExerciseImageSize } from "./exercise-image";
import { ExercisePickerLoading } from "./exercise-picker-loading";
import { Gap } from "./gap";
import { HairlineRow } from "./hairline";
import { Spacing } from "./spacing";

type ExercisePickerOptionsProps = {
  exercises: Promise<ExerciseCatalogResponse>;
  name: string;
  query: bg.UseTextFieldReturnType;
  value: string | null | undefined;
  onChange: (exercise: ExerciseCatalogItem) => void;
};

export function ExercisePicker(props: ExercisePickerOptionsProps & { onCancel?: () => void }) {
  const t = bg.useTranslations();
  const { onCancel, ...options } = props;

  return (
    <div data-minh="0" data-stack="y" data-wrap="nowrap" {...Gap.cluster}>
      <div data-stack="x" {...Gap.inline}>
        <div data-grow="1" data-position="relative" data-stack="x">
          <Search data-color="neutral-500" data-left="2-5" data-position="absolute" data-size="sm" />

          <input
            aria-label={t("exercise.picker.label")}
            className="c-input"
            data-pl="8"
            data-width="100%"
            placeholder={t("exercise.picker.placeholder")}
            type="search"
            {...props.query.input.props}
          />
        </div>

        {onCancel && <ButtonCancel data-shrink="0" onClick={onCancel} />}
      </div>

      <ul
        aria-label={t("exercise.picker.label")}
        data-bc="alpha-medium"
        data-br="md"
        data-bs="solid"
        data-bw="hairline"
        data-minh="0"
        data-overflow="auto"
        data-stack="y"
        style={{ maxHeight: "40vh" }}
      >
        <Suspense fallback={<ExercisePickerLoading />}>
          <ExercisePickerOptions {...options} />
        </Suspense>
      </ul>
    </div>
  );
}

function ExercisePickerOptions(props: ExercisePickerOptionsProps) {
  const t = bg.useTranslations();
  const exercises = use(props.exercises);

  const matching = exercises.data.filter((exercise) =>
    exercise.name.toLowerCase().includes((props.query.value ?? "").trim().toLowerCase()),
  );

  return (
    <>
      {matching.length === 0 && (
        <li data-color="neutral-500" data-main="center" data-stack="x" {...Spacing.surface}>
          {t("exercise.picker.empty")}
        </li>
      )}

      {matching.map((exercise, index) => (
        <HairlineRow first={index === 0} key={exercise.id} tone="subtle">
          <label
            data-bg={props.value === exercise.id ? "alpha-subtle" : undefined}
            data-color={props.value === exercise.id ? "neutral-0" : "neutral-200"}
            data-cursor="pointer"
            data-hover-bg="alpha-subtle"
            data-position="relative"
            data-px="3"
            data-stack="x"
            {...Spacing.rowCompact}
          >
            <input
              checked={props.value === exercise.id}
              data-cursor="pointer"
              data-inset="0"
              data-opacity="none"
              data-position="absolute"
              name={props.name}
              onChange={() => props.onChange(exercise)}
              type="radio"
              value={exercise.id}
            />

            <span aria-hidden data-shrink="0" data-stack="x">
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
              style={{ flexShrink: 2, maxWidth: "40%" }}
            >
              {exercise.categories.map((category) => category.name).join(", ")}
            </span>

            {props.value === exercise.id && <Check data-color="brand-400" data-shrink="0" data-size="sm" />}
          </label>
        </HairlineRow>
      ))}
    </>
  );
}
