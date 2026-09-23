import * as bg from "@bgord/ui";
import { createLink, type LinkComponent } from "@tanstack/react-router";
import { Gap } from "./gap";
import { Meta } from "./meta";
import { Spacing } from "./spacing";

const TILE_WIDTH = 168;

const item = {
  "data-grow": "1",
  "data-md-width": "100%",
  ...bg.Rhythm(TILE_WIDTH).times(1).style.width,
} as const;

const card = {
  className: "c-card",
  "data-cross": "center",
  "data-md-cross": "baseline",
  "data-md-main": "between",
  "data-md-py": "3",
  "data-md-stack": "x",
  "data-md-wrap": "wrap",
  "data-stack": "y",
  ...Spacing.surface,
  ...Gap.inline,
} as const;

export function Tile(props: React.JSX.IntrinsicElements["li"]) {
  return <li {...item} {...card} {...props} />;
}

function TileAnchor(props: React.JSX.IntrinsicElements["a"]) {
  return (
    <li {...item}>
      <a {...card} data-height="100%" {...props} />
    </li>
  );
}

const TileAnchorLink = createLink(TileAnchor);

export const TileLink: LinkComponent<typeof TileAnchor> = (props) => (
  <TileAnchorLink activeProps={{}} {...props} />
);

export function TileHeader(props: React.JSX.IntrinsicElements["div"]) {
  return (
    <div
      data-color="neutral-600"
      data-cross="center"
      data-fs="xs"
      data-md-width="100%"
      data-stack="x"
      data-wrap="wrap"
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
      data-wrap="wrap"
      {...Gap.cluster}
      {...props}
    />
  );
}

export function TileContext(props: React.JSX.IntrinsicElements["div"]) {
  return <Meta data-md-ml="auto" {...props} />;
}
