import * as bg from "@bgord/ui";
import { useNavigate } from "@tanstack/react-router";
import { CircleHelp } from "lucide-react";
import { Form as ExerciseCatalogFilters } from "../../app/services/exercise-catalog-filters-form";
import { Form as WorkoutHistoryFilters } from "../../app/services/workout-history-filters-form";
import { ButtonClose, Kbd } from "../components";

export function Shortcuts() {
  const { width } = bg.useWindowDimensions();
  const t = bg.useTranslations();
  const navigate = useNavigate();
  const help = bg.useToggle({ name: "shortcuts" });

  bg.useScrollLock(help.on);

  bg.useShortcuts({
    "g w": () => navigate({ search: WorkoutHistoryFilters.default, to: "/workouts" }),
    "g c": () => navigate({ search: ExerciseCatalogFilters.default, to: "/catalog" }),
    "g p": () => navigate({ to: "/plans" }),
    "[Shift]+?": help.toggle,
    Escape: help.disable,
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
          <div data-color="neutral-0" data-fs="lg" data-fw="bold">
            {t("app.shortcuts.header")}
          </div>

          <ButtonClose onClick={help.disable} title={t("app.shortcuts.close")} />
        </div>

        <ul data-gap="2" data-stack="y">
          <ShortcutRow keys="g w" label={t("app.workouts")} />
          <ShortcutRow keys="g c" label={t("app.catalog")} />
          <ShortcutRow keys="g p" label={t("app.plans")} />
          <ShortcutRow keys="?" label={t("app.shortcuts.help")} />
        </ul>
      </div>
    </div>
  );
}

function ShortcutRow(props: { keys: string; label: string }) {
  return (
    <li data-cross="center" data-gap="3" data-main="between" data-stack="x">
      <span data-color="neutral-200" data-fs="sm">
        {props.label}
      </span>

      <Kbd keys={props.keys} />
    </li>
  );
}
