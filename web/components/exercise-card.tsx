import * as bg from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import type { ExerciseWithCategories } from "../../modules/exercises/value-objects/exercise-with-categories";
import { Chip } from "./chip";
import { ExerciseImage, ExerciseImageSize } from "./exercise-image";
import { Gap } from "./gap";
import { Spacing } from "./spacing";

const VISIBLE_CATEGORIES = 2;

export function ExerciseCard(props: ExerciseWithCategories) {
  const visible = props.categories.slice(0, VISIBLE_CATEGORIES);
  const rest = props.categories.length - visible.length;

  return (
    <li data-maxw="100%" data-md-grow="1" data-stack="y" {...bg.Rhythm(232).times(1).style.width}>
      <Link
        className="c-card"
        data-grow="1"
        data-hover-bc="brand-500"
        params={{ exerciseId: props.id }}
        title={props.name}
        to="/catalog/exercise/$exerciseId"
        {...Spacing.surfaceCompact}
        {...Gap.related}
      >
        <span aria-hidden data-disp="flex">
          <ExerciseImage size={ExerciseImageSize.md} {...props} />
        </span>

        <div className="c-card-title" data-fs="sm" data-fw="medium" data-transform="line-clamp">
          {props.name}
        </div>

        <ul data-mt="auto" data-overflow="hidden" data-stack="x" data-wrap="nowrap" {...Gap.cluster}>
          {visible.map((category) => (
            <li key={category.id}>
              <Chip data-transform="truncate">{category.name}</Chip>
            </li>
          ))}

          {rest > 0 && (
            <li>
              <Chip muted title={props.categories.map((category) => category.name).join(", ")}>
                +{rest}
              </Chip>
            </li>
          )}
        </ul>
      </Link>
    </li>
  );
}
