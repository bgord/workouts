import * as bg from "@bgord/ui";
import { Check, Search } from "lucide-react";
import type { ExerciseWithCategories } from "../../modules/exercises/value-objects/exercise-with-categories";
import { ButtonCancel } from "./button-cancel";
import { ExerciseImage, ExerciseImageSize } from "./exercise-image";

const shrinkable = { minHeight: 0 };
const list = { ...shrinkable, maxHeight: "40vh" };
const categories = { flexShrink: 2, maxWidth: "40%" };

export function ExercisePicker(props: {
  exercises: ReadonlyArray<ExerciseWithCategories>;
  name: string;
  query: bg.UseTextFieldReturnType;
  value: string | null | undefined;
  onChange: (id: string) => void;
  onCancel?: () => void;
}) {
  const t = bg.useTranslations();

  const matching = props.exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes((props.query.value ?? "").trim().toLowerCase()),
  );

  return (
    <div data-gap="2" data-stack="y" data-wrap="nowrap" style={shrinkable}>
      <div data-cross="center" data-gap="1" data-stack="x" data-wrap="nowrap">
        <div data-cross="center" data-grow="1" data-position="relative" data-stack="x">
          <Search data-color="neutral-500" data-left="2-5" data-position="absolute" data-size="sm" />

          <input
            aria-label={t("exercise.picker.label")}
            className="c-input"
            data-pl="8"
            data-variant="transparent"
            data-width="100%"
            placeholder={t("exercise.picker.placeholder")}
            type="search"
            {...props.query.input.props}
          />
        </div>

        {props.onCancel && <ButtonCancel data-shrink="0" onClick={props.onCancel} />}
      </div>

      <ul
        aria-label={t("exercise.picker.label")}
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
            {t("exercise.picker.empty")}
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
              data-bg={props.value === exercise.id ? "alpha-subtle" : undefined}
              data-color={props.value === exercise.id ? "neutral-0" : "neutral-200"}
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
                checked={props.value === exercise.id}
                className="c-visually-hidden"
                name={props.name}
                onChange={() => props.onChange(exercise.id)}
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

              {props.value === exercise.id && <Check data-color="brand-400" data-shrink="0" data-size="sm" />}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
