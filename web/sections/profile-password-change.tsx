import * as bg from "@bgord/ui";
import { KeyRound, Send } from "lucide-react";
import * as ui from "../components";
import { rootRoute } from "../router";

export function ProfilePasswordChange() {
  const t = bg.useTranslations();

  const { session } = rootRoute.useLoaderData();

  const mutation = bg.useMutation({
    perform: () =>
      fetch("/api/auth/request-password-reset", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email, redirectTo: "/public/reset-password.html" }),
      }),
    autoResetDelayMs: 5000,
  });

  return (
    <section className="c-card" data-variant="flat" {...ui.Spacing.surface} {...ui.Gap.related}>
      <div data-stack="x" {...ui.Gap.cluster}>
        <KeyRound data-color="neutral-400" data-size="sm" />
        <h2>{t("auth.change_password.header")}</h2>
      </div>

      <div data-color="neutral-500">{t("auth.change_password.desc")}</div>

      <form
        aria-busy={mutation.isLoading}
        data-stack="x"
        data-wrap="wrap"
        onSubmit={mutation.handleSubmit}
        {...ui.Gap.related}
      >
        <button
          className="c-button"
          data-variant="ghost"
          disabled={mutation.isLoading || mutation.isDone}
          type="submit"
        >
          <Send data-size="sm" />
          {mutation.isLoading ? t("auth.change_password.sending") : t("auth.change_password.send_cta")}
        </button>

        {mutation.isDone && <output data-tone="positive">{t("auth.change_password.sent")}</output>}

        {mutation.isError && (
          <output aria-live="assertive" data-tone="danger">
            {t("auth.change_password.error")}
          </output>
        )}
      </form>
    </section>
  );
}
