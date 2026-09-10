import { Rhythm } from "@bgord/ui";
import type { Exercise } from "../../modules/exercises/value-objects/exercise";

export enum ExerciseImageSize {
  sm = "sm",
  md = "md",
  lg = "lg",
}

const width: Record<ExerciseImageSize, number> = {
  [ExerciseImageSize.sm]: 80,
  [ExerciseImageSize.md]: 208,
  [ExerciseImageSize.lg]: 320,
};

const height: Record<ExerciseImageSize, number> = {
  [ExerciseImageSize.sm]: 60,
  [ExerciseImageSize.md]: 156,
  [ExerciseImageSize.lg]: 240,
};

export function ExerciseImage(props: {
  exercise: Pick<Exercise, "id" | "name" | "imageEtag">;
  size: ExerciseImageSize;
}) {
  const src = props.exercise.imageEtag
    ? `/api/exercises/${props.exercise.id}/image?etag=${props.exercise.imageEtag}`
    : `/api/exercises/${props.exercise.id}/image`;

  return (
    <img
      alt={props.exercise.name}
      data-bg="neutral-0"
      data-br="sm"
      data-maxw="100%"
      data-object-fit="contain"
      loading="lazy"
      src={src}
      style={{
        ...Rhythm(width[props.size]).times(1).width,
        ...Rhythm(height[props.size]).times(1).height,
      }}
    />
  );
}
