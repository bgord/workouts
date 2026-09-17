import * as bg from "@bgord/ui";

const tones = {
  brand: { "data-color": "brand-400", "data-hover-color": "brand-300" },
  danger: { "data-color": "neutral-400", "data-hover-color": "danger-400" },
  neutral: { "data-color": "neutral-400", "data-hover-color": "neutral-0" },
  positive: { "data-color": "positive-400", "data-hover-color": "positive-200" },
} as const;

export type IconButtonTone = keyof typeof tones;

export function IconButton(props: React.JSX.IntrinsicElements["button"] & { tone?: IconButtonTone }) {
  const { tone = "neutral", ...rest } = props;

  return (
    <button
      className="c-button"
      data-px="0"
      data-shrink="0"
      data-variant="ghost"
      type="button"
      {...tones[tone]}
      {...bg.Rhythm().times(3).style.width}
      {...rest}
    />
  );
}
