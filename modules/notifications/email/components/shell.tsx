import { Body, Container, Head, Html, Preview, Section, Text } from "@react-email/components";
import { theme } from "../theme";
import { Logo } from "./logo";
import { Rule } from "./rule";

const styles = {
  body: { margin: 0, padding: "40px 16px", background: theme.color.page, fontFamily: theme.font.family },
  container: {
    maxWidth: theme.width.card,
    background: theme.color.card,
    border: `1px solid ${theme.color.border}`,
    borderRadius: theme.radius.card,
  },
  content: { padding: "28px 32px" },
  signature: { margin: 0, fontSize: "15px", lineHeight: 1.6, color: theme.color.textStrong },
} satisfies Record<string, React.CSSProperties>;

type ShellProps = { preview?: string; signature: string; children: React.ReactNode };

export function Shell(props: ShellProps) {
  return (
    <Html lang="en">
      <Head />
      {props.preview && <Preview>{props.preview}</Preview>}
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.content}>
            <Logo />
            <Rule />
            {props.children}
            <Rule />
            <Text style={styles.signature}>{props.signature}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
