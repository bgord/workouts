import { theme } from "../theme";

const styles = {
  table: { width: "auto", borderCollapse: "collapse" },
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
    <table border={0} cellPadding="0" cellSpacing="0" role="presentation" style={styles.table} width="auto">
      <tbody>
        <tr>
          <td style={styles.bar} />
          <td style={styles.gap} />
          <td style={styles.bar} />
          <td style={styles.gap} />
          <td style={styles.bar} />
          <td style={styles.word}>Workouts</td>
        </tr>
      </tbody>
    </table>
  );
}
