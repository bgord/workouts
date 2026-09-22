import * as bg from "@bgord/bun";
import { render } from "@react-email/components";
import { createElement } from "react";
import * as v from "valibot";

export async function renderEmail<Props extends object>(
  template: React.ComponentType<Props>,
  props: Props,
): Promise<bg.MailerContentHtmlType> {
  return v.parse(bg.MailerContentHtml, await render(createElement(template, props)));
}
