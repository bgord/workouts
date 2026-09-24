import * as bg from "@bgord/ui";
import type { Exercise } from "../../modules/exercises/value-objects/exercise";

export enum ExerciseImageSize {
  xs = "xs",
  sm = "sm",
  md = "md",
  lg = "lg",
}

const width: Record<ExerciseImageSize, number> = {
  [ExerciseImageSize.xs]: 48,
  [ExerciseImageSize.sm]: 80,
  [ExerciseImageSize.md]: 208,
  [ExerciseImageSize.lg]: 320,
};

const height: Record<ExerciseImageSize, number> = {
  [ExerciseImageSize.xs]: 36,
  [ExerciseImageSize.sm]: 60,
  [ExerciseImageSize.md]: 156,
  [ExerciseImageSize.lg]: 240,
};

const style = (size: ExerciseImageSize) =>
  size === ExerciseImageSize.xs || size === ExerciseImageSize.sm
    ? { ...bg.Rhythm(width[size]).times(1).width, ...bg.Rhythm(height[size]).times(1).height }
    : { width: "100%", aspectRatio: `${width[size]} / ${height[size]}` };

type ExerciseImageProps = Pick<Exercise, "id" | "name" | "imageEtag"> & { size: ExerciseImageSize };

export function ExerciseImagePlaceholder(props: { size: ExerciseImageSize }) {
  return <span data-bg="alpha-subtle" data-br="sm" style={style(props.size)} />;
}

export function ExerciseImage(props: ExerciseImageProps) {
  const src = props.imageEtag
    ? `/api/exercises/${props.id}/image?etag=${props.imageEtag}`
    : `/api/exercises/${props.id}/image`;

  return (
    <img
      alt={props.name}
      data-bg="neutral-0"
      data-br="sm"
      data-maxw="100%"
      data-object-fit="contain"
      loading="lazy"
      src={src}
      style={style(props.size)}
    />
  );
}
