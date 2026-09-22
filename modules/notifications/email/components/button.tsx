import { Button as EmailButton } from "@react-email/components";
import { theme } from "../theme";

const styles = {
  button: {
    display: "inline-block",
    marginTop: "24px",
    padding: "10px 16px",
    lineHeight: "16px",
    fontSize: "14px",
    fontWeight: 500,
    color: theme.color.textInverted,
    background: theme.color.fillStrong,
    borderRadius: theme.radius.control,
    textDecoration: "none",
  },
} satisfies Record<string, React.CSSProperties>;

export function Button(props: React.ComponentProps<typeof EmailButton>) {
  return <EmailButton {...props} style={{ ...styles.button, ...props.style }} />;
}
