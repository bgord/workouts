import { useMutation, useTranslations } from "@bgord/ui";
import { CircleAlert, CircleCheck, KeyRound } from "lucide-react";
import { rootRoute } from "../router";

export function ProfilePasswordChange() {
  const t = useTranslations();

  const { session } = rootRoute.useLoaderData();

  const mutation = useMutation({
    perform: () =>
      fetch("/api/auth/request-password-reset", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email, redirectTo: "/reset-password" }),
      }),
    autoResetDelayMs: 5000,
  });

  return (
    <section className="c-card" data-gap="5" data-variant="flat">
      <div data-cross="center" data-gap="3" data-stack="x">
        <KeyRound data-color="neutral-400" data-size="sm" />
        <div className="c-card-title">{t("auth.change_password.header")}</div>
      </div>

      <div data-color="neutral-500" data-fs="sm">
        {t("auth.change_password.desc")}
      </div>

      <form aria-busy={mutation.isLoading} data-gap="3" data-stack="x" onSubmit={mutation.handleSubmit}>
        <button
          className="c-button"
          data-variant="secondary"
          disabled={mutation.isLoading || mutation.isDone}
          type="submit"
        >
          {mutation.isLoading ? t("auth.change_password.sending") : t("auth.change_password.send_cta")}
        </button>

        {mutation.isDone && (
          <output
            aria-live="polite"
            data-color="positive-400"
            data-cross="center"
            data-fs="sm"
            data-gap="2"
            data-stack="x"
          >
            <CircleCheck data-size="sm" />
            {t("auth.change_password.sent")}
          </output>
        )}

        {mutation.isError && (
          <output
            aria-live="assertive"
            data-color="danger-400"
            data-cross="center"
            data-fs="sm"
            data-gap="2"
            data-stack="x"
          >
            <CircleAlert data-size="sm" />
            {t("auth.change_password.error")}
          </output>
        )}
      </form>
    </section>
  );
}
