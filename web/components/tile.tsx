import { createLink, type LinkComponent } from "@tanstack/react-router";
import { createContext, useContext, useId } from "react";
import { Gap } from "./gap";
import { Spacing } from "./spacing";

const item = {
  "data-grow": "1",
  "data-tile": "",
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

const TileHeaderId = createContext<string | undefined>(undefined);

export function Tile(props: React.JSX.IntrinsicElements["li"]) {
  const header = useId();

  return (
    <TileHeaderId.Provider value={header}>
      <li aria-labelledby={header} {...item} {...card} {...props} />
    </TileHeaderId.Provider>
  );
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

export function TileHeader(props: React.JSX.IntrinsicElements["small"]) {
  const id = useContext(TileHeaderId);

  return (
    <small
      data-color="neutral-600"
      data-md-width="100%"
      data-stack="x"
      data-wrap="wrap"
      id={id}
      {...Gap.inline}
      {...props}
    />
  );
}

export function TileValue(props: React.JSX.IntrinsicElements["div"]) {
  return (
    <div
      data-color="neutral-0"
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

export function TileContext(props: React.JSX.IntrinsicElements["small"]) {
  return <small data-md-ml="auto" {...props} />;
}
