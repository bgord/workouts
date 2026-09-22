import { Text } from "@react-email/components";
import { theme } from "../theme";

const styles = {
  paragraph: { margin: "12px 0 0", fontSize: "15px", lineHeight: 1.6, color: theme.color.textPrimary },
} satisfies Record<string, React.CSSProperties>;

export function Paragraph(props: React.ComponentProps<typeof Text>) {
  return <Text {...props} style={{ ...styles.paragraph, ...props.style }} />;
}
