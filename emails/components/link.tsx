import { Link as EmailLink } from "@react-email/components";
import { theme } from "../theme";

const styles = {
  link: { color: theme.color.link, textDecoration: "underline" },
} satisfies Record<string, React.CSSProperties>;

export function Link(props: React.ComponentProps<typeof EmailLink>) {
  return <EmailLink {...props} style={{ ...styles.link, ...props.style }} />;
}
