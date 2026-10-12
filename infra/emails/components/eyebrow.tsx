import { theme } from "../theme";

const styles = {
  eyebrow: {
    margin: 0,
    fontSize: "11px",
    lineHeight: 1.5,
    letterSpacing: ".08em",
    textTransform: "uppercase",
    color: theme.color.textMuted,
  },
} satisfies Record<string, React.CSSProperties>;

export function Eyebrow(props: React.JSX.IntrinsicElements["p"]) {
  return <p {...props} style={{ ...styles.eyebrow, ...props.style }} />;
}
