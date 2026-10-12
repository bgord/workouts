import { theme } from "../theme";

const styles = {
  link: { color: theme.color.link, textDecoration: "underline" },
} satisfies Record<string, React.CSSProperties>;

export function Link(props: React.JSX.IntrinsicElements["a"]) {
  return <a target="_blank" {...props} style={{ ...styles.link, ...props.style }} />;
}
