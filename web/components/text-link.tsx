import { Spacing } from "./spacing";

const style = {
  className: "c-link",
  "data-color": "neutral-400",
  "data-cross": "center",
  "data-cursor": "pointer",
  "data-fs": "xs",
  "data-stack": "x",
  ...Spacing.inline,
} as const;

export function TextLink(props: React.JSX.IntrinsicElements["button"]) {
  return <button type="button" {...style} {...props} />;
}

export function TextLinkAnchor(props: React.JSX.IntrinsicElements["a"]) {
  return <a {...style} {...props} />;
}
