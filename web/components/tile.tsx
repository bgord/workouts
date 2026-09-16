import { Rhythm } from "@bgord/ui";
import { createLink } from "@tanstack/react-router";

const TILE_WIDTH = 168;

const item = {
  "data-grow": "1",
  "data-md-width": "100%",
  ...Rhythm(TILE_WIDTH).times(1).style.width,
} as const;

const card = {
  className: "c-card",
  "data-cross": "center",
  "data-gap": "1",
  "data-md-cross": "baseline",
  "data-md-main": "between",
  "data-md-py": "3",
  "data-md-stack": "x",
  "data-md-wrap": "wrap",
  "data-p": "4",
  "data-stack": "y",
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
      data-color="neutral-500"
      data-cross="center"
      data-fs="xs"
      data-gap="1-5"
      data-ls="wide"
      data-md-width="100%"
      data-stack="x"
      data-transform="uppercase"
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
      data-gap="2"
      data-lh="tight"
      data-stack="x"
      {...props}
    />
  );
}

export function TileContext(props: React.JSX.IntrinsicElements["div"]) {
  return <div data-color="neutral-500" data-fs="xs" data-md-ml="auto" {...props} />;
}
