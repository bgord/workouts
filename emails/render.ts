import * as bg from "@bgord/bun";
import { render } from "@react-email/components";
import * as v from "valibot";

export async function renderEmail(element: React.ReactElement): Promise<bg.MailerContentHtmlType> {
  return v.parse(bg.MailerContentHtml, await render(element));
}
