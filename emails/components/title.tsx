import { Text } from "@react-email/components";
import { theme } from "../theme";

const styles = {
  title: {
    margin: "4px 0 0",
    fontSize: "20px",
    lineHeight: 1.3,
    fontWeight: 600,
    color: theme.color.textStrong,
  },
} satisfies Record<string, React.CSSProperties>;

export function Title(props: React.ComponentProps<typeof Text>) {
  return <Text {...props} style={{ ...styles.title, ...props.style }} />;
}
