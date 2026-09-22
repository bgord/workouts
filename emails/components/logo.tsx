import { Column, Row } from "@react-email/components";
import { theme } from "../theme";

const styles = {
  row: { width: "auto", borderCollapse: "collapse" },
  bar: {
    width: "4px",
    height: "30px",
    background: theme.color.accent,
    fontSize: 0,
    lineHeight: 0,
    padding: 0,
  },
  gap: { width: "3px", fontSize: 0, lineHeight: 0, padding: 0 },
  word: {
    padding: "0 0 0 10px",
    fontSize: "24px",
    lineHeight: "30px",
    fontWeight: 700,
    letterSpacing: ".05em",
    textTransform: "uppercase",
    color: theme.color.accent,
    whiteSpace: "nowrap",
    verticalAlign: "middle",
  },
} satisfies Record<string, React.CSSProperties>;

export function Logo() {
  return (
    <Row align={undefined} style={styles.row} width="auto">
      <Column style={styles.bar} />
      <Column style={styles.gap} />
      <Column style={styles.bar} />
      <Column style={styles.gap} />
      <Column style={styles.bar} />
      <Column style={styles.word}>Workouts</Column>
    </Row>
  );
}
