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

  const groups: Record<string, { header: string; shortcuts: Array<ShortcutDefinitions.ShortcutType> }> = {
    "/": { header: t("app.dashboard"), shortcuts: ShortcutDefinitions.DashboardGroup },
    "/catalog": { header: t("app.catalog"), shortcuts: ShortcutDefinitions.CatalogGroup },
    "/workouts": { header: t("app.workouts"), shortcuts: ShortcutDefinitions.WorkoutsGroup },
    "/measurements": { header: t("app.measurements"), shortcuts: ShortcutDefinitions.MeasurementsGroup },
  };

  const group = groups[pathname];

  return (
    <>
      <button
        aria-label={t("app.shortcuts.help")}
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

      <ui.Dialog {...shortcuts}>
        <ui.DialogHeader onClose={shortcuts.disable}>
          <span data-cross="center" data-stack="x" {...ui.Gap.cluster}>
            <Keyboard data-size="sm" />
            {t("app.shortcuts.header")}
          </span>
        </ui.DialogHeader>

        {group && <ShortcutGroup {...group} />}

        <ShortcutGroup header={t("app.shortcuts.global")} shortcuts={ShortcutDefinitions.GlobalGroup} />
      </ui.Dialog>
    </>
  );
}
