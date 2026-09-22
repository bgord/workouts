import { describe, expect, test } from "bun:test";
import * as Notifications from "+notifications";

describe("Notifications.Email.Shell", () => {
  test("renders the shell around the content", async () => {
    const html = await Notifications.Email.renderEmail(
      <Notifications.Email.Shell preview="Preview" signature="— Workouts">
        <Notifications.Email.Eyebrow>Eyebrow</Notifications.Email.Eyebrow>
        <Notifications.Email.Title>Title</Notifications.Email.Title>
        <Notifications.Email.Paragraph>Intro &lt;b&gt;bold&lt;/b&gt;</Notifications.Email.Paragraph>
        <Notifications.Email.Button href="http://example.com/?token=abc&x=1">Go</Notifications.Email.Button>
        <Notifications.Email.Heading>Heading</Notifications.Email.Heading>
        <Notifications.Email.Note>
          Note{" "}
          <Notifications.Email.Link href="http://example.com/?token=abc&x=1">link</Notifications.Email.Link>
        </Notifications.Email.Note>
      </Notifications.Email.Shell>,
    );

    expect(html).toStartWith("<!DOCTYPE html");
    expect(html).toContain('<html dir="ltr" lang="en">');
    expect(html).toContain(">Preview<");
    expect(html).toContain(`background:${Notifications.Email.theme.color.accent}`);
    expect(html).toContain(">Workouts</td>");
    expect(html).toContain(`max-width:${Notifications.Email.theme.width.card}`);
    expect(html).toContain(">Eyebrow</p>");
    expect(html).toContain(">Title</p>");
    expect(html).toContain(">Intro &lt;b&gt;bold&lt;/b&gt;</p>");
    expect(html).toContain('href="http://example.com/?token=abc&amp;x=1"');
    expect(html).toContain(">Heading</p>");
    expect(html).toContain(">link</a>");
    expect(html).toContain(">— Workouts</p>");
    expect(html).not.toContain("<b>bold</b>");
  });

  test("style overrides merge with the defaults", async () => {
    const html = await Notifications.Email.renderEmail(
      <Notifications.Email.Shell signature="— Workouts">
        <Notifications.Email.Paragraph style={{ color: "#000000" }}>Intro</Notifications.Email.Paragraph>
      </Notifications.Email.Shell>,
    );

    expect(html).toContain("font-size:15px");
    expect(html).toContain("color:#000000");
    expect(html).not.toContain(`color:${Notifications.Email.theme.color.textPrimary}`);
  });
});
