import * as bg from "@bgord/ui";
import * as ui from "../components";
import type * as ShortcutDefinitions from "../services/shortcuts";

export function ShortcutGroup(props: { header: string; shortcuts: Array<ShortcutDefinitions.ShortcutType> }) {
  const t = bg.useTranslations();

  return (
    <div data-stack="y" {...ui.Spacing.cluster}>
      <ui.Eyebrow>{props.header}</ui.Eyebrow>

      <ul data-stack="y" {...ui.Spacing.cluster}>
        {props.shortcuts.map((shortcut) => (
          <li
            data-cross="center"
            data-main="between"
            data-stack="x"
            key={shortcut.keys}
            {...ui.Spacing.related}
          >
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
