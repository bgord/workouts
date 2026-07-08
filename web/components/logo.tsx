import { useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";

export function Logo() {
  const t = useTranslations();

  return (
    <div className="logo" data-color="brand-600" data-fs="2xl" data-fw="bold" data-ls="wider">
      <Link data-focus-ring="neutral" to="/">
        {t("app.name")}
      </Link>
    </div>
  );
}
