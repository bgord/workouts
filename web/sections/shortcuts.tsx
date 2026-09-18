import * as bg from "@bgord/ui";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { CircleHelp, Keyboard } from "lucide-react";
import { Form as BodyWeightMeasurementFilters } from "../../app/services/body-weight-measurement-filters-form";
import { Form as ExerciseCatalogFilters } from "../../app/services/exercise-catalog-filters-form";
import { Form as WorkoutHistoryFilters } from "../../app/services/workout-history-filters-form";
import * as ui from "../components";
import * as ShortcutDefinitions from "../services/shortcuts";
import { ShortcutGroup } from "./shortcut-group";

export function Shortcuts() {
  const { width } = bg.useWindowDimensions();
  const t = bg.useTranslations();
  const navigate = useNavigate();

  const shortcuts = bg.useToggle({ name: "shortcuts" });
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  bg.useScrollLock(shortcuts.on);

  bg.useShortcuts({
    [ShortcutDefinitions.GoToDashboard.trigger]: () => navigate({ to: "/" }),
    [ShortcutDefinitions.GoToWorkouts.trigger]: () =>
      navigate({ search: WorkoutHistoryFilters.default, to: "/workouts" }),
    [ShortcutDefinitions.GoToCatalog.trigger]: () =>
      navigate({ search: ExerciseCatalogFilters.default, to: "/catalog" }),
    [ShortcutDefinitions.GoToPlans.trigger]: () => navigate({ to: "/plans" }),
    [ShortcutDefinitions.GoToMeasurements.trigger]: () =>
      navigate({ search: BodyWeightMeasurementFilters.default, to: "/measurements" }),
    [ShortcutDefinitions.ToggleHelp.trigger]: shortcuts.toggle,
    [ShortcutDefinitions.CloseHelp.trigger]: shortcuts.disable,
  });

  if (!width || width <= 768) return null;

  if (shortcuts.off) {
    return (
      <button
        className="c-button"
        data-bottom="4"
        data-interaction="subtle-scale"
        data-position="fixed"
        data-right="4"
        data-variant="secondary"
        onClick={shortcuts.enable}
        title={t("app.shortcuts.help")}
        type="button"
        {...shortcuts.props.controller}
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
      data-stack="x"
      data-z="3"
      style={{ backgroundColor: "var(--backdrop-medium)" }}
      {...ui.Spacing.gutter}
      {...shortcuts.props.target}
    >
      <div
        className="c-card"
        data-maxw="md"
        data-stack="y"
        data-variant="overlay"
        data-width="100%"
        {...ui.Gap.block}
      >
        <div data-cross="center" data-main="between" data-stack="x">
          <div
            data-color="neutral-0"
            data-cross="center"
            data-fs="lg"
            data-fw="bold"
            data-stack="x"
            {...ui.Gap.cluster}
          >
            <Keyboard data-size="sm" />

            {t("app.shortcuts.header")}
          </div>

          <ui.ButtonClose onClick={shortcuts.disable} title={t("app.shortcuts.close")} />
        </div>

        {pathname === "/" && (
          <ShortcutGroup header={t("app.dashboard")} shortcuts={ShortcutDefinitions.DashboardGroup} />
        )}

        {pathname === "/catalog" && (
          <ShortcutGroup header={t("app.catalog")} shortcuts={ShortcutDefinitions.CatalogGroup} />
        )}

        {pathname === "/workouts" && (
          <ShortcutGroup header={t("app.workouts")} shortcuts={ShortcutDefinitions.WorkoutsGroup} />
        )}

        {pathname === "/measurements" && (
          <ShortcutGroup header={t("app.measurements")} shortcuts={ShortcutDefinitions.MeasurementsGroup} />
        )}

        <ShortcutGroup header={t("app.shortcuts.global")} shortcuts={ShortcutDefinitions.GlobalGroup} />
      </div>
    </div>
  );
}
