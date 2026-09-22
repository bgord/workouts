import { Text } from "@react-email/components";
import type * as Notifications from "+notifications";
import { WeeklySummaryBlockKinds } from "+notifications/services/weekly-summary-notification";
import { Changes, Eyebrow, Heading, Link, Paragraph, Shell, Stat, Tiles, Title } from "../components";
import { theme } from "../theme";

const styles = {
  eyebrow: { marginTop: "24px" },
  text: { marginTop: "24px" },
  footer: { margin: "36px 0 0", fontSize: "12px", lineHeight: 1.6, color: theme.color.textMuted },
} satisfies Record<string, React.CSSProperties>;

type BlockProps = { block: Notifications.Services.WeeklySummaryNotificationBlock };

const key = (block: Notifications.Services.WeeklySummaryNotificationBlock) =>
  block.kind === WeeklySummaryBlockKinds.heading ? `${block.kind}-${block.text}` : block.kind;

function Block(props: BlockProps) {
  switch (props.block.kind) {
    case WeeklySummaryBlockKinds.heading:
      return <Heading>{props.block.text}</Heading>;
    case WeeklySummaryBlockKinds.tiles:
      return <Tiles tiles={props.block.tiles} />;
    case WeeklySummaryBlockKinds.text:
      return <Paragraph style={styles.text}>{props.block.text}</Paragraph>;
    case WeeklySummaryBlockKinds.changes:
      return <Changes rows={props.block.rows} />;
    case WeeklySummaryBlockKinds.stat:
      return <Stat caption={props.block.caption} note={props.block.note} value={props.block.value} />;
  }
}

export function WeeklySummaryEmail(props: Notifications.Services.WeeklySummaryNotificationContent) {
  return (
    <Shell preview={props.title} signature={props.signature}>
      <Eyebrow style={styles.eyebrow}>{props.eyebrow}</Eyebrow>
      <Title>{props.title}</Title>

      {props.blocks.map((block) => (
        <Block block={block} key={key(block)} />
      ))}

      <Text style={styles.footer}>
        {props.footer.before}
        <Link href={props.footer.url}>{props.footer.link}</Link>
        {props.footer.after}
      </Text>
    </Shell>
  );
}
