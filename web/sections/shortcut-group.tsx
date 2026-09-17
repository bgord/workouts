import * as bg from "@bgord/ui";
import { Kbd } from "../components";
import type * as ShortcutDefinitions from "../services/shortcuts";

export function ShortcutGroup(props: { header: string; shortcuts: Array<ShortcutDefinitions.ShortcutType> }) {
  const t = bg.useTranslations();

  return (
    <div data-gap="2" data-stack="y">
      <div data-color="neutral-400" data-fs="xs" data-ls="wide">
        {props.header}
      </div>

      <ul data-gap="2" data-stack="y">
        {props.shortcuts.map((shortcut) => (
          <li data-cross="center" data-gap="3" data-main="between" data-stack="x" key={shortcut.keys}>
            <span data-color="neutral-200" data-fs="sm">
              {t(shortcut.label)}
            </span>

            <Kbd keys={shortcut.keys} />
          </li>
        ))}
      </ul>
    </div>
  );
}
