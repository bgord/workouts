import * as bg from "@bgord/ui";
import { Check, Copy, X } from "lucide-react";
import { useState } from "react";

type CopyButtonState = "idle" | "done" | "failed";

const icons = { idle: Copy, done: Check, failed: X };

const tones = { idle: "neutral", done: "brand", failed: "danger" } as const;

function useCopy(text: () => string) {
  const [state, setState] = useState<CopyButtonState>("idle");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text());
      setState("done");
    } catch {
      setState("failed");
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
    setState("idle");
  };

  return { state, copy };
}

export function CopyMenuItem(
  props: React.JSX.IntrinsicElements["button"] & { text: () => string; done: string },
) {
  const { text, done, children, ...rest } = props;
  const t = bg.useTranslations();
  const menu = bg.useMenu();
  const { state, copy } = useCopy(text);

  const labels = { idle: children, done, failed: t("app.copy.error") };
  const Icon = icons[state];

  return (
    <bg.MenuItem
      onClick={async (event) => {
        event.preventDefault();
        await copy();
        if (menu.content.current?.contains(document.activeElement)) menu.close();
      }}
      tone={tones[state]}
      {...rest}
    >
      <Icon data-size="sm" />
      {labels[state]}
    </bg.MenuItem>
  );
}
