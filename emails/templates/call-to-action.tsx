import type * as Auth from "+auth";
import { Button, Link, Note, Paragraph, Shell } from "../components";

export function CallToActionEmail(props: Auth.Services.CallToActionNotificationContent) {
  return (
    <Shell signature="— Workouts">
      <Paragraph>Hi,</Paragraph>
      <Paragraph>{props.intro}</Paragraph>
      <Button href={props.url}>{props.cta}</Button>
      <Note style={{ marginTop: "24px" }}>{props.note}</Note>
      <Note>
        Button not working? Paste this into your browser:
        <br />
        <Link href={props.url} style={{ wordBreak: "break-all" }}>
          {props.url}
        </Link>
      </Note>
    </Shell>
  );
}
