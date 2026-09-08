// cSpell:ignore VIEWBOX
import { useLanguage, useTranslations } from "@bgord/ui";
import { DateFormat } from "../../app/services/date-format";
import type { ExerciseSession } from "../../modules/stats/value-objects/exercise-history";

const GRAMS_IN_KILOGRAM = 1000;

const VIEWBOX = { width: 720, height: 180 };
const PADDING = { top: 12, right: 16, bottom: 24, left: 36 };
const INSET = 20;
const SET_GAP = 9;
const TICKS = 3;

const PLOT = {
  left: PADDING.left,
  right: VIEWBOX.width - PADDING.right,
  top: PADDING.top,
  bottom: VIEWBOX.height - PADDING.bottom,
};

export function ExerciseHistoryChart(props: {
  sessions: ReadonlyArray<ExerciseSession>;
  selected?: ExerciseSession["workoutId"];
  onSelect: (workoutId: ExerciseSession["workoutId"]) => void;
}) {
  const t = useTranslations();
  const language = useLanguage();

  const loads = props.sessions.flatMap((session) => session.sets.map((set) => set.load));
  const heaviest = Math.max(...loads) / GRAMS_IN_KILOGRAM;
  const scale = Math.max(5, Math.ceil(heaviest / 5) * 5);

  const moments = props.sessions.map((session) => session.completedAt);
  const first = Math.min(...moments);
  const last = Math.max(...moments);

  const x = (completedAt: number) => {
    const span = PLOT.right - PLOT.left - INSET * 2;

    if (last === first) return PLOT.left + INSET + span / 2;

    return PLOT.left + INSET + ((completedAt - first) / (last - first)) * span;
  };

  const y = (load: number) => PLOT.bottom - (load / GRAMS_IN_KILOGRAM / scale) * (PLOT.bottom - PLOT.top);

  const ticks = Array.from({ length: TICKS }, (_, index) => (scale / (TICKS - 1)) * index);

  return (
    <svg
      aria-label={t("exercise.history.chart.label")}
      data-color="neutral-400"
      role="img"
      style={{ width: "100%", height: "auto" }}
      viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
    >
      {ticks.map((tick) => (
        <g key={tick}>
          <line
            opacity="0.15"
            stroke="currentColor"
            x1={PLOT.left}
            x2={PLOT.right}
            y1={y(tick * GRAMS_IN_KILOGRAM)}
            y2={y(tick * GRAMS_IN_KILOGRAM)}
          />

          <text
            dominantBaseline="middle"
            fill="currentColor"
            fontSize="11"
            textAnchor="end"
            x={PLOT.left - 8}
            y={y(tick * GRAMS_IN_KILOGRAM)}
          >
            {tick}
          </text>
        </g>
      ))}

      {props.sessions.map((session, index) => {
        const day = DateFormat.dayWithWeekday(language, DateFormat.zoned(session.completedAt).toPlainDate());
        const center = x(session.completedAt);
        const width = session.sets.length * SET_GAP + INSET;
        const selected = props.selected === session.workoutId;

        return (
          <g key={session.workoutId}>
            {/* biome-ignore lint/a11y/useSemanticElements: a button cannot be a child of svg */}
            <rect
              aria-label={day}
              fill="transparent"
              height={PLOT.bottom - PLOT.top}
              onClick={() => props.onSelect(session.workoutId)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") props.onSelect(session.workoutId);
              }}
              role="button"
              style={{ cursor: "pointer" }}
              tabIndex={0}
              width={width}
              x={center - width / 2}
              y={PLOT.top}
            />

            {session.sets.map((set, position) => (
              <circle
                cx={center + (position - (session.sets.length - 1) / 2) * SET_GAP}
                cy={y(set.load)}
                data-color={selected ? "brand-300" : "neutral-200"}
                fill="currentColor"
                key={`${session.workoutId}-${position}`}
                opacity={selected ? "1" : "0.8"}
                pointerEvents="none"
                r={selected ? "6" : "4.5"}
              >
                <title>
                  {`${day} · ${t("workout.exercise.logged_set", {
                    reps: set.reps,
                    load: set.load / GRAMS_IN_KILOGRAM,
                  })}`}
                </title>
              </circle>
            ))}

            {(index === 0 || index === props.sessions.length - 1) && (
              <text
                fill="currentColor"
                fontSize="11"
                textAnchor={index === 0 ? "start" : "end"}
                x={index === 0 ? PLOT.left : PLOT.right}
                y={VIEWBOX.height - 8}
              >
                {day}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
