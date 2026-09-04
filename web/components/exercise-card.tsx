import * as bg from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import type { ExerciseWithCategories } from "../../modules/exercises/value-objects/exercise-with-categories";
import { ExerciseImage, ExerciseImageSize } from "./exercise-image";

export function ExerciseCard(props: { exercise: ExerciseWithCategories }) {
  return (
    <li
      data-bc="neutral-800"
      data-bg="neutral-800"
      data-br="md"
      data-bs="solid"
      data-bw="hairline"
      data-gap="2"
      data-hover-bc="brand-800"
      data-hover-shadow="md"
      data-maxw="100%"
      data-p="3"
      data-shadow="sm"
      data-stack="y"
      {...bg.Rhythm(232).times(1).style.width}
    >
      <Link
        aria-hidden
        data-disp="flex"
        params={{ exerciseId: props.exercise.id }}
        tabIndex={-1}
        to="/catalog/exercise/$exerciseId"
      >
        <ExerciseImage exercise={props.exercise} size={ExerciseImageSize.md} />
      </Link>

      <Link
        data-color="neutral-0"
        data-focus-ring="neutral"
        data-fs="base"
        data-fw="bold"
        data-hover-color="brand-300"
        data-maxw="100%"
        data-transform="truncate"
        params={{ exerciseId: props.exercise.id }}
        title={props.exercise.name}
        to="/catalog/exercise/$exerciseId"
      >
        {props.exercise.name}
      </Link>

      <ul data-gap="1" data-mt="auto" data-overflow="hidden" data-stack="x" data-wrap="nowrap">
        {props.exercise.categories.map((category) => (
          <li className="c-badge" data-variant="outline" key={category.id}>
            {category.name}
          </li>
        ))}
      </ul>
    </li>
  );
}
