import { Text } from "@react-email/components";
import { theme } from "../theme";

const styles = {
  stat: { margin: "8px 0 0", fontSize: "14px", lineHeight: 1.5, color: theme.color.textStrong },
  value: { fontSize: "20px", fontWeight: 600, fontVariantNumeric: theme.font.tabular },
  caption: { color: theme.color.textSecondary },
  note: {
    margin: "4px 0 0",
    fontSize: "13px",
    lineHeight: 1.5,
    color: theme.color.textSecondary,
    fontVariantNumeric: theme.font.tabular,
  },
} satisfies Record<string, React.CSSProperties>;

type StatProps = { value: string; caption: string; note?: string };

export function Stat(props: StatProps) {
  return (
    <>
      <Text style={styles.stat}>
        <span style={styles.value}>{props.value}</span>
        <span style={styles.caption}>{` ${props.caption}`}</span>
      </Text>
      {props.note && <Text style={styles.note}>{props.note}</Text>}
    </>
  );
}
