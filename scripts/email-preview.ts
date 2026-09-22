import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import * as Emails from "+emails";

const BETTER_AUTH_URL = v.parse(tools.UrlWithoutSlash, "http://localhost:3000");
const url = v.parse(tools.UrlWithoutSlash, `${BETTER_AUTH_URL}/auth/verify?token=abcdef123456`);

const templates = {
  "password-reset": () =>
    Emails.renderEmail(
      Emails.CallToActionEmail,
      new Auth.Services.PasswordResetNotificationComposer().compose(url).content,
    ),
  "email-verification": () =>
    Emails.renderEmail(
      Emails.CallToActionEmail,
      new Auth.Services.EmailVerificationNotificationComposer(BETTER_AUTH_URL).compose(url).content,
    ),
};

type TemplateName = keyof typeof templates;

void (async function main() {
  const name = process.argv[2] as TemplateName | undefined;

  if (!(name && name in templates)) {
    console.error(`Usage: bun run scripts/email-preview.ts <${Object.keys(templates).join("|")}>`);
    process.exit(1);
  }

  const html = await templates[name]();
  const path = `tmp/email-preview-${name}.html`;

  await Bun.write(path, html);
  console.log(path);

  Bun.spawn(["open", path]);
})();
