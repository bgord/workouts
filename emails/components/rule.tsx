import { theme } from "../theme";

const styles = {
  rule: { width: "100%", margin: "24px 0", border: 0, borderTop: `1px solid ${theme.color.border}` },
} satisfies Record<string, React.CSSProperties>;

export function Rule(props: React.JSX.IntrinsicElements["hr"]) {
  return <hr {...props} style={{ ...styles.rule, ...props.style }} />;
}
