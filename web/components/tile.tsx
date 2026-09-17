import { Rhythm } from "@bgord/ui";
import { createLink } from "@tanstack/react-router";
import { Gap } from "./gap";
import { Meta } from "./meta";

const TILE_WIDTH = 168;

const item = {
  "data-grow": "1",
  "data-md-width": "100%",
  ...Rhythm(TILE_WIDTH).times(1).style.width,
} as const;

const card = {
  className: "c-card",
  "data-cross": "center",
  "data-md-cross": "baseline",
  "data-md-main": "between",
  "data-md-py": "3",
  "data-md-stack": "x",
  "data-md-wrap": "wrap",
  "data-p": "4",
  "data-stack": "y",
  ...Gap.inline,
} as const;

export function Tile(props: React.JSX.IntrinsicElements["li"]) {
  return <li {...item} {...card} {...props} />;
}

export const TileLink = createLink((props: React.JSX.IntrinsicElements["a"]) => (
  <li {...item}>
    <a {...card} data-height="100%" {...props} />
  </li>
));

export function TileHeader(props: React.JSX.IntrinsicElements["div"]) {
  return (
    <div
      data-color="neutral-600"
      data-cross="center"
      data-fs="xs"
      data-md-width="100%"
      data-stack="x"
      {...Gap.inline}
      {...props}
    />
  );
}

export function TileValue(props: React.JSX.IntrinsicElements["div"]) {
  return (
    <div
      data-color="neutral-0"
      data-cross="center"
      data-fs="xl"
      data-fw="semibold"
      data-lh="tight"
      data-stack="x"
      {...Gap.cluster}
      {...props}
    />
  );
}

export function TileContext(props: React.JSX.IntrinsicElements["div"]) {
  return <Meta data-md-ml="auto" {...props} />;
}
