import { theme } from "../theme";

type OutlookStyle = React.CSSProperties & { msoPaddingAlt?: string; msoTextRaise?: string };

const styles = {
  button: {
    display: "inline-block",
    maxWidth: "100%",
    marginTop: "24px",
    padding: "10px 16px",
    lineHeight: "16px",
    fontSize: "14px",
    fontWeight: 500,
    color: theme.color.textInverted,
    background: theme.color.fillStrong,
    borderRadius: theme.radius.control,
    textDecoration: "none",
    msoPaddingAlt: "0px",
  },
  label: {
    display: "inline-block",
    maxWidth: "100%",
    lineHeight: "120%",
    msoPaddingAlt: "0px",
    msoTextRaise: "7.5px",
  },
} satisfies Record<string, OutlookStyle>;

const msoLeading =
  '<!--[if mso]><i style="mso-font-width:400%;mso-text-raise:15" hidden>&#8202;&#8202;</i><![endif]-->';
const msoTrailing =
  '<!--[if mso]><i style="mso-font-width:400%" hidden>&#8202;&#8202;&#8203;</i><![endif]-->';

export function Button(props: React.JSX.IntrinsicElements["a"]) {
  const { children, ...rest } = props;

  return (
    <a target="_blank" {...rest} style={{ ...styles.button, ...props.style }}>
      <span dangerouslySetInnerHTML={{ __html: msoLeading }} />
      <span style={styles.label}>{children}</span>
      <span dangerouslySetInnerHTML={{ __html: msoTrailing }} />
    </a>
  );
}
