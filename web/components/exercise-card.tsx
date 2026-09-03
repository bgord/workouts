import * as bg from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import type { ExerciseWithCategories } from "../../modules/exercises/value-objects/exercise-with-categories";
import { ExerciseImage, ExerciseImageSize } from "./exercise-image";

export function ExerciseCard(props: { exercise: ExerciseWithCategories }) {
  return (
    <li
      data-bc="neutral-700"
      data-bg="neutral-800"
      data-br="md"
      data-bs="solid"
      data-bw="hairline"
      data-gap="2"
      data-maxw="100%"
      data-p="2"
      data-stack="y"
      {...bg.Rhythm(176).times(1).style.width}
    >
      <ExerciseImage exercise={props.exercise} size={ExerciseImageSize.md} />

      <Link
        className="c-link"
        data-maxw="100%"
        data-transform="truncate"
        params={{ exerciseId: props.exercise.id }}
        title={props.exercise.name}
        to="/workbook/exercise/$exerciseId"
      >
        {props.exercise.name}
      </Link>

      <ul data-gap="1" data-overflow="hidden" data-stack="x" data-wrap="nowrap">
        {props.exercise.categories.map((category) => (
          <li className="c-badge" data-variant="outline" key={category.id}>
            {category.name}
          </li>
        ))}
      </ul>
    </li>
  );
}
