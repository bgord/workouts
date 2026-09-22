import { Column, Row } from "@react-email/components";
import { theme } from "../theme";

const styles = {
  row: {
    marginTop: "24px",
    border: `1px solid ${theme.color.border}`,
    borderRadius: theme.radius.control,
    borderCollapse: "separate",
  },
  cell: { padding: "14px 12px", verticalAlign: "top" },
  divider: { borderRight: `1px solid ${theme.color.border}` },
  value: {
    fontSize: "24px",
    lineHeight: 1.2,
    fontWeight: 600,
    color: theme.color.textStrong,
    fontVariantNumeric: theme.font.tabular,
  },
  label: { marginTop: "2px", fontSize: "12px", lineHeight: 1.4, color: theme.color.textSecondary },
  delta: {
    marginTop: "6px",
    fontSize: "12px",
    lineHeight: 1.4,
    color: theme.color.textMuted,
    fontVariantNumeric: theme.font.tabular,
  },
} satisfies Record<string, React.CSSProperties>;

type Tile = { value: string; label: string; delta: string };

type TilesProps = { tiles: ReadonlyArray<Tile> };

export function Tiles(props: TilesProps) {
  return (
    <Row style={styles.row}>
      {props.tiles.map((tile, index) => {
        const last = index === props.tiles.length - 1;
        const width = Math.floor(100 / props.tiles.length) + (last ? 100 % props.tiles.length : 0);

        return (
          <Column
            key={tile.label}
            style={{ ...styles.cell, ...(last ? {} : styles.divider) }}
            width={`${width}%`}
          >
            <div style={styles.value}>{tile.value}</div>
            <div style={styles.label}>{tile.label}</div>
            <div style={styles.delta}>{tile.delta}</div>
          </Column>
        );
      })}
    </Row>
  );
}
