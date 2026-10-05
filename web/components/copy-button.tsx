import * as bg from "@bgord/ui";
import { Check, Copy, X } from "lucide-react";
import { useState } from "react";
import { IconButton } from "./icon-button";

type CopyButtonState = "idle" | "done" | "failed";

const icons = { idle: Copy, done: Check, failed: X };

const tones = { idle: "neutral", done: "brand", failed: "danger" } as const;

export function CopyButton(
  props: React.JSX.IntrinsicElements["button"] & { text: () => string; title: string; done: string },
) {
  const { text, title, done, ...rest } = props;
  const t = bg.useTranslations();
  const [state, setState] = useState<CopyButtonState>("idle");

  const titles = { idle: title, done, failed: t("app.copy.error") };
  const Icon = icons[state];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text());
      setState("done");
    } catch {
      setState("failed");
    }

    setTimeout(() => setState("idle"), 2000);
  };

  return (
    <IconButton onClick={copy} title={titles[state]} tone={tones[state]} {...rest}>
      <Icon data-size="sm" />
    </IconButton>
  );
}
