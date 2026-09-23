export type IconButtonTone = "brand" | "danger" | "neutral" | "positive";

export function IconButton(props: React.JSX.IntrinsicElements["button"] & { tone?: IconButtonTone }) {
  const { tone = "neutral", ...rest } = props;

  return (
    <button
      className="c-button"
      data-tone={tone === "neutral" ? undefined : tone}
      data-variant="icon"
      type="button"
      {...rest}
    />
  );
}
