import * as bg from "@bgord/ui";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as ui from "../components";
import { useLogPanel } from "../hooks/use-log-panel";

export function WorkoutLogPanelStep(props: { direction: "previous" | "next" }) {
  const t = bg.useTranslations();
  const logPanel = useLogPanel();

  const sibling = logPanel[props.direction];

  const title = sibling
    ? t(`workout.log_panel.${props.direction}.title`, { name: sibling.exerciseName })
    : t(`workout.log_panel.${props.direction}`);

  return (
    <ui.IconButton
      aria-label={title}
      disabled={!sibling}
      onClick={() => sibling && logPanel.open(sibling.id)}
      title={title}
    >
      {props.direction === "previous" ? <ChevronLeft data-size="sm" /> : <ChevronRight data-size="sm" />}
    </ui.IconButton>
  );
}
