import * as bg from "@bgord/bun";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as v from "valibot";

const DOCTYPE =
  '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';

export async function renderEmail<Props extends object>(
  template: React.ComponentType<Props>,
  props: Props,
): Promise<bg.MailerContentHtmlType> {
  return v.parse(bg.MailerContentHtml, `${DOCTYPE}${renderToStaticMarkup(createElement(template, props))}`);
}
