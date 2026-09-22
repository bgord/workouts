const styles = {
  page: "margin:0;padding:0;background:#f4f4f5;",
  canvas: "background:#f4f4f5;margin:0;padding:0;",
  card: "max-width:520px;background:#fcfcfc;border:1px solid #e0e1e3;border-radius:12px;",
  content:
    "padding:28px 32px;font-family:system-ui,-apple-system,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;",
  logo: {
    bar: "width:4px;height:30px;background:#e87231;font-size:0;line-height:0;padding:0;",
    gap: "width:3px;font-size:0;line-height:0;padding:0;",
    word: "padding:0 0 0 10px;font-size:24px;line-height:30px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#e87231;white-space:nowrap;vertical-align:middle;",
  },
  rule: "height:24px;border-bottom:1px solid #e0e1e3;font-size:0;",
  signature: "margin:16px 0 0;font-size:15px;line-height:1.6;color:#0f131a;",
};

const logo = `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:auto;border-collapse:collapse;"><tr>
      <td width="4" height="30" style="${styles.logo.bar}"></td><td width="3" style="${styles.logo.gap}"></td>
      <td width="4" height="30" style="${styles.logo.bar}"></td><td width="3" style="${styles.logo.gap}"></td>
      <td width="4" height="30" style="${styles.logo.bar}"></td>
      <td style="${styles.logo.word}">Workouts</td>
    </tr></table>
    <div style="${styles.rule}">&nbsp;</div>`;

export const escape = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

type NotificationShellConfig = { body: string; signature: string };

export class NotificationShell {
  static render(config: NotificationShellConfig): string {
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="${styles.page}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="${styles.canvas}">
<tr><td align="center" style="padding:40px 16px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="${styles.card}">
  <tr><td style="${styles.content}">${logo}${config.body}
    <div style="${styles.rule}">&nbsp;</div>
    <p style="${styles.signature}">${escape(config.signature)}</p>
  </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
  }
}
