import * as bg from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import type { ExerciseWithCategories } from "../../modules/exercises/value-objects/exercise-with-categories";
import { ExerciseImage, ExerciseImageSize } from "./exercise-image";

export function ExerciseCard(props: { exercise: ExerciseWithCategories }) {
  return (
    <li data-maxw="100%" data-stack="y" {...bg.Rhythm(232).times(1).style.width}>
      <Link
        className="c-card"
        data-gap="3"
        data-grow="1"
        params={{ exerciseId: props.exercise.id }}
        title={props.exercise.name}
        to="/catalog/exercise/$exerciseId"
      >
        <span aria-hidden data-disp="flex">
          <ExerciseImage exercise={props.exercise} size={ExerciseImageSize.md} />
        </span>

        <div className="c-card-title" data-fs="sm" data-fw="medium" data-transform="line-clamp">
          {props.exercise.name}
        </div>

        <ul data-gap="1" data-overflow="hidden" data-stack="x" data-wrap="nowrap">
          {props.exercise.categories.map((category) => (
            <li className="c-badge" data-variant="outline" key={category.id}>
              {category.name}
            </li>
          ))}
        </ul>
      </Link>
    </li>
  );
}
