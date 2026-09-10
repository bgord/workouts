import * as bg from "@bgord/ui";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { CircleHelp, Keyboard } from "lucide-react";
import { Form as ExerciseCatalogFilters } from "../../app/services/exercise-catalog-filters-form";
import { Form as WorkoutHistoryFilters } from "../../app/services/workout-history-filters-form";
import { ButtonClose, Kbd } from "../components";
import * as ShortcutDefinitions from "../services/shortcuts";

export function Shortcuts() {
  const { width } = bg.useWindowDimensions();
  const t = bg.useTranslations();
  const navigate = useNavigate();
  const help = bg.useToggle({ name: "shortcuts" });
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  bg.useScrollLock(help.on);

  bg.useShortcuts({
    [ShortcutDefinitions.GoToWorkouts.trigger]: () =>
      navigate({ search: WorkoutHistoryFilters.default, to: "/workouts" }),
    [ShortcutDefinitions.GoToCatalog.trigger]: () =>
      navigate({ search: ExerciseCatalogFilters.default, to: "/catalog" }),
    [ShortcutDefinitions.GoToPlans.trigger]: () => navigate({ to: "/plans" }),
    [ShortcutDefinitions.ToggleHelp.trigger]: help.toggle,
    [ShortcutDefinitions.CloseHelp.trigger]: help.disable,
  });

  if (!width || width <= 768) return null;

  if (help.off) {
    return (
      <button
        className="c-button"
        data-bottom="4"
        data-interaction="subtle-scale"
        data-position="fixed"
        data-right="4"
        data-variant="secondary"
        onClick={help.enable}
        title={t("app.shortcuts.help")}
        type="button"
        {...help.props.controller}
      >
        <CircleHelp data-size="md" />
      </button>
    );
  }

  return (
    <div
      data-cross="center"
      data-inset="0"
      data-main="center"
      data-position="fixed"
      data-px="3"
      data-stack="x"
      data-z="3"
      style={{ backgroundColor: "var(--backdrop-medium)" }}
      {...help.props.target}
    >
      <div
        className="c-card"
        data-gap="4"
        data-maxw="md"
        data-stack="y"
        data-variant="overlay"
        data-width="100%"
      >
        <div data-cross="center" data-main="between" data-stack="x">
          <div
            data-color="neutral-0"
            data-cross="center"
            data-fs="lg"
            data-fw="bold"
            data-gap="2"
            data-stack="x"
          >
            <Keyboard data-size="sm" />

            {t("app.shortcuts.header")}
          </div>

          <ButtonClose onClick={help.disable} title={t("app.shortcuts.close")} />
        </div>

        {pathname === "/workouts" && (
          <ShortcutGroup header={t("app.workouts")} shortcuts={ShortcutDefinitions.Workouts} />
        )}

        <ShortcutGroup header={t("app.shortcuts.global")} shortcuts={ShortcutDefinitions.Global} />
      </div>
    </div>
  );
}

function ShortcutGroup(props: { header: string; shortcuts: Array<ShortcutDefinitions.ShortcutType> }) {
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
