import * as bg from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import type { ExerciseWithCategories } from "../../modules/exercises/value-objects/exercise-with-categories";
import { ExerciseImage, ExerciseImageSize } from "./exercise-image";

const VISIBLE_CATEGORIES = 2;

export function ExerciseCard(props: ExerciseWithCategories) {
  const visible = props.categories.slice(0, VISIBLE_CATEGORIES);
  const rest = props.categories.length - visible.length;

  return (
    <li data-maxw="100%" data-stack="y" {...bg.Rhythm(232).times(1).style.width}>
      <Link
        className="c-card"
        data-gap="3"
        data-grow="1"
        data-hover-bc="brand-500"
        data-p="3"
        params={{ exerciseId: props.id }}
        title={props.name}
        to="/catalog/exercise/$exerciseId"
      >
        <span aria-hidden data-disp="flex">
          <ExerciseImage size={ExerciseImageSize.md} {...props} />
        </span>

        <div className="c-card-title" data-fs="sm" data-fw="medium" data-transform="line-clamp">
          {props.name}
        </div>

        <ul data-gap="1" data-mt="auto" data-overflow="hidden" data-stack="x" data-wrap="nowrap">
          {visible.map((category) => (
            <li className="c-badge" data-transform="truncate" data-variant="outline" key={category.id}>
              {category.name}
            </li>
          ))}

          {rest > 0 && (
            <li
              className="c-badge"
              data-color="neutral-400"
              data-variant="outline"
              title={props.categories.map((category) => category.name).join(", ")}
            >
              +{rest}
            </li>
          )}
        </ul>
      </Link>
    </li>
  );
}
