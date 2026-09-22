import { Text } from "@react-email/components";
import type * as Notifications from "+notifications";
import { Link, Shell, Title } from "../components";
import { theme } from "../theme";

const styles = {
  title: { marginTop: "24px" },
  footer: { margin: "36px 0 0", fontSize: "12px", lineHeight: 1.6, color: theme.color.textMuted },
} satisfies Record<string, React.CSSProperties>;

export function WeeklySummaryEmail(props: Notifications.Services.WeeklySummaryNotificationContent) {
  return (
    <Shell preview={props.title} signature={props.signature}>
      <Title style={styles.title}>{props.title}</Title>

      <Text style={styles.footer}>
        {props.footer.before}
        <Link href={props.footer.url}>{props.footer.link}</Link>
        {props.footer.after}
      </Text>
    </Shell>
  );
}
