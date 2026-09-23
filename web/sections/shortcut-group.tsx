import * as bg from "@bgord/ui";
import * as ui from "../components";
import type * as ShortcutDefinitions from "../services/shortcuts";

export function ShortcutGroup(props: { header: string; shortcuts: Array<ShortcutDefinitions.ShortcutType> }) {
  const t = bg.useTranslations();

  return (
    <div data-stack="y" {...ui.Gap.cluster}>
      <h3>{props.header}</h3>

      <ul data-stack="y" {...ui.Gap.cluster}>
        {props.shortcuts.map((shortcut) => (
          <li data-main="between" data-stack="x" data-wrap="wrap" key={shortcut.keys} {...ui.Gap.related}>
            <span data-color="neutral-200" data-fs="sm">
              {t(shortcut.label)}
            </span>

            <kbd>{shortcut.keys}</kbd>
          </li>
        ))}
      </ul>
    </div>
  );
}
