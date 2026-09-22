import { Text } from "@react-email/components";
import type * as Notifications from "+notifications";
import { Changes, Eyebrow, Heading, Link, Paragraph, Shell, Tiles, Title } from "../components";
import { theme } from "../theme";

const styles = {
  eyebrow: { marginTop: "24px" },
  empty: { marginTop: "24px" },
  bodyWeight: { margin: "8px 0 0", fontSize: "14px", lineHeight: 1.5, color: theme.color.textStrong },
  bodyWeightValue: { fontSize: "20px", fontWeight: 600, fontVariantNumeric: theme.font.tabular },
  bodyWeightCaption: { color: theme.color.textSecondary },
  bodyWeightNote: {
    margin: "4px 0 0",
    fontSize: "13px",
    lineHeight: 1.5,
    color: theme.color.textSecondary,
    fontVariantNumeric: theme.font.tabular,
  },
  footer: { margin: "36px 0 0", fontSize: "12px", lineHeight: 1.6, color: theme.color.textMuted },
} satisfies Record<string, React.CSSProperties>;

export function WeeklySummaryEmail(props: Notifications.Services.WeeklySummaryNotificationContent) {
  return (
    <Shell preview={props.title} signature={props.signature}>
      <Eyebrow style={styles.eyebrow}>{props.eyebrow}</Eyebrow>
      <Title>{props.title}</Title>

      {"empty" in props.numbers ? (
        <Paragraph style={styles.empty}>{props.numbers.empty}</Paragraph>
      ) : (
        <Tiles tiles={props.numbers.tiles} />
      )}

      {props.highlights.rows.length > 0 && (
        <>
          <Heading>{props.highlights.heading}</Heading>
          <Changes rows={props.highlights.rows} />
        </>
      )}

      {props.bodyWeight && (
        <>
          <Heading>{props.bodyWeight.heading}</Heading>
          <Text style={styles.bodyWeight}>
            <span style={styles.bodyWeightValue}>{props.bodyWeight.value}</span>
            <span style={styles.bodyWeightCaption}>{` ${props.bodyWeight.caption}`}</span>
          </Text>
          {props.bodyWeight.note && <Text style={styles.bodyWeightNote}>{props.bodyWeight.note}</Text>}
        </>
      )}

      <Text style={styles.footer}>
        {props.footer.before}
        <Link href={props.footer.url}>{props.footer.link}</Link>
        {props.footer.after}
      </Text>
    </Shell>
  );
}
