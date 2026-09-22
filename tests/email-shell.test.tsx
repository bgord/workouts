import { describe, expect, test } from "bun:test";
import * as Emails from "+emails";

describe("Emails.Shell", () => {
  test("renders the shell around the content", async () => {
    const html = await Emails.renderEmail(Emails.Shell, {
      preview: "Preview",
      signature: "— Workouts",
      children: (
        <>
          <Emails.Eyebrow>Eyebrow</Emails.Eyebrow>
          <Emails.Title>Title</Emails.Title>
          <Emails.Paragraph>Intro &lt;b&gt;bold&lt;/b&gt;</Emails.Paragraph>
          <Emails.Button href="http://example.com/?token=abc&x=1">Go</Emails.Button>
          <Emails.Heading>Heading</Emails.Heading>
          <Emails.Note>
            Note <Emails.Link href="http://example.com/?token=abc&x=1">link</Emails.Link>
          </Emails.Note>
        </>
      ),
    });

    expect(html).toStartWith("<!DOCTYPE html");
    expect(html).toContain('<html dir="ltr" lang="en">');
    expect(html).toContain(">Preview<");
    expect(html).toContain(`background:${Emails.theme.color.accent}`);
    expect(html).toContain(">Workouts</td>");
    expect(html).toContain(`max-width:${Emails.theme.width.card}`);
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
    const html = await Emails.renderEmail(Emails.Shell, {
      signature: "— Workouts",
      children: <Emails.Paragraph style={{ color: "#000000" }}>Intro</Emails.Paragraph>,
    });

    expect(html).toContain("font-size:15px");
    expect(html).toContain("color:#000000");
    expect(html).not.toContain(`color:${Emails.theme.color.textPrimary}`);
  });
});
