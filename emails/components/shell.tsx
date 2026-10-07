import { theme } from "../theme";
import { Logo } from "./logo";
import { Rule } from "./rule";

const PREVIEW_MAX_LENGTH = 150;
const PREVIEW_FILLER = " ‌​‍‎‏﻿";

const styles = {
  body: { margin: 0, padding: 0, background: theme.color.page },
  page: { margin: 0, padding: "40px 16px", background: theme.color.page, fontFamily: theme.font.family },
  card: {
    maxWidth: theme.width.card,
    background: theme.color.card,
    border: `1px solid ${theme.color.border}`,
    borderRadius: theme.radius.card,
  },
  content: { padding: "28px 32px" },
  preview: {
    display: "none",
    overflow: "hidden",
    lineHeight: "1px",
    opacity: 0,
    maxHeight: 0,
    maxWidth: 0,
  },
  signature: { margin: 0, fontSize: "15px", lineHeight: 1.6, color: theme.color.textStrong },
} satisfies Record<string, React.CSSProperties>;

type ShellProps = { preview?: string; signature: string; children: React.ReactNode };

export function Shell(props: ShellProps) {
  const preview = props.preview?.substring(0, PREVIEW_MAX_LENGTH);

  return (
    <html dir="ltr" lang="en">
      <head>
        <meta content="text/html; charset=UTF-8" httpEquiv="Content-Type" />
        <meta name="x-apple-disable-message-reformatting" />
      </head>
      <body style={styles.body}>
        {preview && (
          <div style={styles.preview}>
            {preview}
            <div>{PREVIEW_FILLER.repeat(PREVIEW_MAX_LENGTH - preview.length)}</div>
          </div>
        )}
        <table align="center" border={0} cellPadding="0" cellSpacing="0" role="presentation" width="100%">
          <tbody>
            <tr>
              <td style={styles.page}>
                <table
                  align="center"
                  border={0}
                  cellPadding="0"
                  cellSpacing="0"
                  role="presentation"
                  style={styles.card}
                  width="100%"
                >
                  <tbody>
                    <tr>
                      <td style={styles.content}>
                        <Logo />
                        <Rule />
                        {props.children}
                        <Rule />
                        <p style={styles.signature}>{props.signature}</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}
