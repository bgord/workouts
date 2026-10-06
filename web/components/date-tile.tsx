import * as bg from "@bgord/ui";

const tile = {
  "data-bc": "alpha-soft",
  "data-bg": "neutral-900",
  "data-br": "lg",
  "data-bs": "solid",
  "data-bw": "hairline",
  "data-cross": "center",
  "data-position": "relative",
  "data-py": "1-5",
  "data-shrink": "0",
  "data-stack": "y",
} as const;

const badges = {
  neutral: { "data-bc": "alpha-soft", "data-bg": "neutral-800", "data-color": "neutral-300" },
  positive: { "data-bc": "positive-800", "data-bg": "positive-900", "data-color": "positive-400" },
} as const;

export type DateTileBadgeTone = keyof typeof badges;

export function DateTile(props: React.JSX.IntrinsicElements["div"]) {
  const { style, ...rest } = props;

  return <div style={{ ...bg.Rhythm().times(5).width, ...style }} {...tile} {...rest} />;
}

export function DateTileButton(props: React.JSX.IntrinsicElements["button"]) {
  const { style, ...rest } = props;

  return (
    <button
      data-cursor="pointer"
      data-hover-bc="alpha-strong"
      data-hover-bg="neutral-850"
      style={{ ...bg.Rhythm().times(5).width, ...style }}
      type="button"
      {...tile}
      {...rest}
    />
  );
}

export function DateTileMonth(props: React.JSX.IntrinsicElements["span"]) {
  return (
    <span
      data-color="brand-400"
      data-fw="semibold"
      data-ls="widest"
      data-transform="uppercase"
      style={{ fontSize: "10px" }}
      {...props}
    />
  );
}

export function DateTileDay(props: React.JSX.IntrinsicElements["span"]) {
  return <span data-color="neutral-0" data-fs="base" data-fw="black" data-lh="tight" {...props} />;
}

export function DateTileWeekday(props: React.JSX.IntrinsicElements["span"]) {
  return <span data-color="neutral-400" style={{ fontSize: "10px" }} {...props} />;
}

export function DateTileBadge(props: React.JSX.IntrinsicElements["span"] & { tone?: DateTileBadgeTone }) {
  const { tone = "neutral", style, ...rest } = props;

  return (
    <span
      data-br="circle"
      data-bs="solid"
      data-bw="hairline"
      data-main="center"
      data-position="absolute"
      data-size="md"
      data-stack="x"
      style={{ bottom: "calc(var(--spacing-1-5) * -1)", right: "calc(var(--spacing-1-5) * -1)", ...style }}
      {...badges[tone]}
      {...rest}
    />
  );
}
