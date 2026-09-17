import * as bg from "@bgord/ui";
import * as ui from "../components";
import type * as ShortcutDefinitions from "../services/shortcuts";

export function ShortcutGroup(props: { header: string; shortcuts: Array<ShortcutDefinitions.ShortcutType> }) {
  const t = bg.useTranslations();

  return (
    <div data-gap="2" data-stack="y">
      <ui.Eyebrow>{props.header}</ui.Eyebrow>

      <ul data-gap="2" data-stack="y">
        {props.shortcuts.map((shortcut) => (
          <li data-cross="center" data-gap="3" data-main="between" data-stack="x" key={shortcut.keys}>
            <span data-color="neutral-200" data-fs="sm">
              {t(shortcut.label)}
            </span>

            <ui.Kbd keys={shortcut.keys} />
          </li>
        ))}
      </ul>
    </div>
  );
}
