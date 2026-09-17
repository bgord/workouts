const tones = { soft: "alpha-soft", subtle: "alpha-subtle" } as const;

export type HairlineTone = keyof typeof tones;

type HairlineProps = { tone?: HairlineTone; first?: boolean; last?: boolean };

function hairline(props: HairlineProps) {
  const { tone = "soft", first } = props;

  if (first) return {};

  return { "data-bct": tones[tone], "data-bst": "solid", "data-bwt": "hairline" } as const;
}

function edges(props: HairlineProps) {
  return {
    ...(props.first ? { "data-pt": "0" as const } : {}),
    ...(props.last ? { "data-pb": "0" as const } : {}),
  };
}

export function HairlineRow(props: React.JSX.IntrinsicElements["li"] & HairlineProps) {
  const { tone, first, last, ...rest } = props;

  return <li {...hairline({ tone, first })} {...rest} {...edges({ first, last })} />;
}

export function HairlineBlock(props: React.JSX.IntrinsicElements["div"] & HairlineProps) {
  const { tone, first, last, ...rest } = props;

  return <div {...hairline({ tone, first })} {...rest} {...edges({ first, last })} />;
}
