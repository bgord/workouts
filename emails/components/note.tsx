import { theme } from "../theme";

const styles = {
  note: { margin: "12px 0 0", fontSize: "13px", lineHeight: 1.6, color: theme.color.textSecondary },
} satisfies Record<string, React.CSSProperties>;

export function Note(props: React.JSX.IntrinsicElements["p"]) {
  return <p {...props} style={{ ...styles.note, ...props.style }} />;
}
