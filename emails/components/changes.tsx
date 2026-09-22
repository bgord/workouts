import { theme } from "../theme";

const styles = {
  table: { width: "100%", marginTop: "8px", borderCollapse: "collapse" },
  name: {
    padding: "10px 0",
    borderBottom: `1px solid ${theme.color.border}`,
    fontSize: "14px",
    lineHeight: 1.5,
    color: theme.color.textStrong,
  },
  change: {
    padding: "10px 0",
    borderBottom: `1px solid ${theme.color.border}`,
    fontSize: "14px",
    lineHeight: 1.5,
    color: theme.color.textSecondary,
    whiteSpace: "nowrap",
    fontVariantNumeric: theme.font.tabular,
  },
  arrow: { color: theme.color.textFaint },
  current: { color: theme.color.textStrong, fontWeight: 500 },
} satisfies Record<string, React.CSSProperties>;

type Change = { name: string; previous: string; current: string };

type ChangesProps = { rows: ReadonlyArray<Change> };

export function Changes(props: ChangesProps) {
  return (
    <table border={0} cellPadding="0" cellSpacing="0" role="presentation" style={styles.table}>
      <tbody>
        {props.rows.map((row) => (
          <tr key={row.name}>
            <td style={styles.name}>{row.name}</td>
            <td align="right" style={styles.change}>
              {row.previous} <span style={styles.arrow}>→</span>{" "}
              <span style={styles.current}>{row.current}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
