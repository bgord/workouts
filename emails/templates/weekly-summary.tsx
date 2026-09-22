import { Column, Row, Text } from "@react-email/components";
import type * as Notifications from "+notifications";
import { Link, Shell, Title } from "../components";
import { theme } from "../theme";

const styles = {
  title: { marginTop: "24px" },
  totals: {
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
  footer: { margin: "36px 0 0", fontSize: "12px", lineHeight: 1.6, color: theme.color.textMuted },
} satisfies Record<string, React.CSSProperties>;

export function WeeklySummaryEmail(props: Notifications.Services.WeeklySummaryNotificationContent) {
  return (
    <Shell preview={props.title} signature={props.signature}>
      <Title style={styles.title}>{props.title}</Title>

      <Row style={styles.totals}>
        {props.totals.map((tile, index) => (
          <Column
            key={tile.label}
            style={index === props.totals.length - 1 ? styles.cell : { ...styles.cell, ...styles.divider }}
            width="33%"
          >
            <div style={styles.value}>{tile.value}</div>
            <div style={styles.label}>{tile.label}</div>
            <div style={styles.delta}>{tile.delta}</div>
          </Column>
        ))}
      </Row>

      <Text style={styles.footer}>
        {props.footer.before}
        <Link href={props.footer.url}>{props.footer.link}</Link>
        {props.footer.after}
      </Text>
    </Shell>
  );
}
