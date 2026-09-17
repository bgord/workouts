const tones = {
  danger: { "aria-live": "assertive", "data-color": "danger-400" },
  positive: { "aria-live": "polite", "data-color": "positive-400" },
} as const;

export type OutputTone = keyof typeof tones;

export function Output(props: React.JSX.IntrinsicElements["output"] & { tone?: OutputTone }) {
  const { tone = "danger", ...rest } = props;

  return <output data-fs="xs" {...tones[tone]} {...rest} />;
}
