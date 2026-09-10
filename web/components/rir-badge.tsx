import { useTranslations } from "@bgord/ui";

type Variant = "primary" | "outline" | "danger";

function variant(rir: number): Variant {
  if (rir === 0) return "danger";
  if (rir <= 2) return "primary";
  return "outline";
}

export function RirBadge(props: { rir: number }) {
  const t = useTranslations();

  return (
    <span
      className="c-badge"
      data-cross="baseline"
      data-variant={variant(props.rir)}
      title={t("workout.set.rir.title")}
    >
      <span data-fs="xs" data-ls="widest" data-opacity="medium">
        {t("workout.set.rir.label")}
      </span>

      <span data-fw="semibold">{props.rir}</span>
    </span>
  );
}
