import { Text } from "@react-email/components";
import { theme } from "../theme";

const styles = {
  heading: {
    margin: "28px 0 0",
    fontSize: "11px",
    lineHeight: 1.5,
    letterSpacing: ".08em",
    textTransform: "uppercase",
    color: theme.color.textMuted,
  },
} satisfies Record<string, React.CSSProperties>;

export function Heading(props: React.ComponentProps<typeof Text>) {
  return <Text {...props} style={{ ...styles.heading, ...props.style }} />;
}
