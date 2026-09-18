import { describe, expect, test } from "bun:test";
import * as Auth from "+auth";

describe("NotificationLayout", () => {
  test("render", () => {
    const html = Auth.Services.NotificationLayout.render({
      intro: "Intro",
      cta: "Go",
      url: "http://example.com/?token=abc",
      note: "Note",
    });

    expect(html).toEqual(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin:0;padding:0;background:#f4f4f5;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f5;margin:0;padding:0;">
<tr><td align="center" style="padding:40px 16px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;background:#fcfcfc;border:1px solid #e0e1e3;border-radius:12px;">
  <tr><td style="padding:28px 32px;font-family:system-ui,-apple-system,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:auto;border-collapse:collapse;"><tr>
      <td width="4" height="30" style="width:4px;height:30px;background:#e87231;font-size:0;line-height:0;padding:0;"></td><td width="3" style="width:3px;font-size:0;line-height:0;padding:0;"></td>
      <td width="4" height="30" style="width:4px;height:30px;background:#e87231;font-size:0;line-height:0;padding:0;"></td><td width="3" style="width:3px;font-size:0;line-height:0;padding:0;"></td>
      <td width="4" height="30" style="width:4px;height:30px;background:#e87231;font-size:0;line-height:0;padding:0;"></td>
      <td style="padding:0 0 0 10px;font-size:24px;line-height:30px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#e87231;white-space:nowrap;vertical-align:middle;">Workouts</td>
    </tr></table>
    <div style="height:24px;border-bottom:1px solid #e0e1e3;font-size:0;">&nbsp;</div>
    <p style="margin:24px 0 0;font-size:15px;line-height:1.6;color:#0f131a;">Hi,</p>
    <p style="margin:12px 0 0;font-size:15px;line-height:1.6;color:#3c4047;">Intro</p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:auto;margin-top:24px;"><tr>
      <td style="background:#0f131a;border-radius:8px;"><a href="http://example.com/?token=abc" style="display:inline-block;padding:0 16px;height:36px;line-height:36px;font-size:14px;font-weight:500;color:#fcfcfc;text-decoration:none;">Go</a></td>
    </tr></table>
    <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#55585e;">Note</p>
    <p style="margin:12px 0 0;font-size:13px;line-height:1.6;color:#55585e;">Button not working? Paste this into your browser:<br /><a href="http://example.com/?token=abc" style="color:#ca5a15;text-decoration:underline;word-break:break-all;">http://example.com/?token=abc</a></p>
    <p style="margin:24px 0 0;font-size:15px;line-height:1.6;color:#0f131a;">— Workouts</p>
  </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`);
  });
});
