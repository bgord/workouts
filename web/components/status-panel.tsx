import { Gap } from "./gap";
import { Spacing } from "./spacing";

const dots = {
  outline: { "data-bc": "neutral-400", "data-bs": "solid", "data-bw": "thin" },
  positive: {
    "data-bg": "positive-400",
    style: {
      boxShadow: "0 0 0 var(--spacing-1) color-mix(in oklch, var(--color-positive-400) 18%, transparent)",
    },
  },
  brand: {
    "data-bg": "brand-400",
    style: {
      boxShadow: "0 0 0 var(--spacing-1) color-mix(in oklch, var(--color-brand-400) 20%, transparent)",
    },
  },
  muted: { "data-bg": "neutral-600" },
} as const;

export type StatusPanelTone = keyof typeof dots;

export function StatusPanel(props: React.JSX.IntrinsicElements["div"]) {
  return (
    <div
      className="c-card"
      data-cross="center"
      data-md-cross="stretch"
      data-md-stack="y"
      data-shadow="none"
      data-stack="x"
      {...Spacing.surfaceCompact}
      {...Gap.related}
      {...props}
    />
  );
}

export function StatusPanelSummary(props: React.JSX.IntrinsicElements["div"]) {
  return <div data-cross="start" data-grow="1" data-minw="0" data-stack="x" {...Gap.cluster} {...props} />;
}

export function StatusPanelDot(props: React.JSX.IntrinsicElements["span"] & { tone: StatusPanelTone }) {
  const { tone, ...rest } = props;
  const { style, ...dot } = { style: {}, ...dots[tone] };

  return (
    <span
      aria-hidden
      data-br="circle"
      data-mt="1-5"
      data-shrink="0"
      style={{ height: "var(--spacing-2-5)", width: "var(--spacing-2-5)", ...style }}
      {...dot}
      {...rest}
    />
  );
}

export function StatusPanelText(props: React.JSX.IntrinsicElements["div"]) {
  return <div data-minw="0" data-stack="y" {...Gap.inline} {...props} />;
}

export function StatusPanelLabel(props: React.JSX.IntrinsicElements["strong"]) {
  return <strong data-color="neutral-100" data-fs="sm" data-fw="semibold" {...props} />;
}

export function StatusPanelDescription(props: React.JSX.IntrinsicElements["small"]) {
  return <small data-color="neutral-400" {...props} />;
}

export function StatusPanelAction(props: React.JSX.IntrinsicElements["div"]) {
  return <div data-md-width="100%" data-shrink="0" data-stack="x" {...Gap.cluster} {...props} />;
}
