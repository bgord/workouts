import { createLink, type LinkComponent } from "@tanstack/react-router";
import { Gap } from "./gap";

export function Chip(props: React.JSX.IntrinsicElements["span"] & { muted?: boolean }) {
  const { muted, ...rest } = props;

  return (
    <span
      className="c-badge"
      data-color={muted ? "neutral-400" : undefined}
      data-cross="center"
      data-variant="outline"
      {...Gap.inline}
      {...rest}
    />
  );
}

export function ChipButton(props: React.JSX.IntrinsicElements["button"] & { pressed: boolean }) {
  const { pressed, ...rest } = props;

  return (
    <button
      aria-pressed={pressed}
      className="c-badge"
      data-cross="center"
      data-cursor="pointer"
      data-variant={pressed ? "primary" : "outline"}
      type="button"
      {...Gap.inline}
      {...rest}
    />
  );
}

function ChipAnchor(props: React.JSX.IntrinsicElements["a"]) {
  return <a className="c-badge" data-variant="outline" {...props} />;
}

const ChipAnchorLink = createLink(ChipAnchor);

export const ChipLink: LinkComponent<typeof ChipAnchor> = (props) => (
  <ChipAnchorLink activeProps={{}} {...props} />
);
