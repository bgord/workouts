import { Hr } from "@react-email/components";
import { theme } from "../theme";

const styles = {
  rule: { margin: "24px 0", border: 0, borderTop: `1px solid ${theme.color.border}` },
} satisfies Record<string, React.CSSProperties>;

export function Rule(props: React.ComponentProps<typeof Hr>) {
  return <Hr {...props} style={{ ...styles.rule, ...props.style }} />;
}
