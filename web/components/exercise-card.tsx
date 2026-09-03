import * as bg from "@bgord/ui";
import type { ExerciseWithCategories } from "../../modules/exercises/value-objects/exercise-with-categories";
import { ExerciseImage, ExerciseImageSize } from "./exercise-image";

export function ExerciseCard(props: { exercise: ExerciseWithCategories }) {
  return (
    <li
      className="c-exercise-card"
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

      <div
        data-fs="sm"
        data-fw="medium"
        data-maxw="100%"
        data-transform="truncate"
        title={props.exercise.name}
      >
        {props.exercise.name}
      </div>

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
