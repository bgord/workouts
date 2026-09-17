import { useMutation, useTranslations } from "@bgord/ui";
import { CircleAlert, CircleCheck, KeyRound, Send } from "lucide-react";
import * as ui from "../components";
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
    <section className="c-card" data-variant="flat" {...ui.Spacing.surface} {...ui.Spacing.related}>
      <div data-cross="center" data-stack="x" {...ui.Spacing.cluster}>
        <KeyRound data-color="neutral-400" data-size="sm" />
        <ui.SectionHeading>{t("auth.change_password.header")}</ui.SectionHeading>
      </div>

      <div data-color="neutral-500" data-fs="sm">
        {t("auth.change_password.desc")}
      </div>

      <form
        aria-busy={mutation.isLoading}
        data-cross="center"
        data-stack="x"
        data-wrap="wrap"
        onSubmit={mutation.handleSubmit}
        {...ui.Spacing.related}
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

        {mutation.isDone && (
          <ui.Output data-cross="center" data-stack="x" tone="positive" {...ui.Spacing.cluster}>
            <CircleCheck data-size="sm" />
            {t("auth.change_password.sent")}
          </ui.Output>
        )}

        {mutation.isError && (
          <ui.Output data-cross="center" data-stack="x" {...ui.Spacing.cluster}>
            <CircleAlert data-size="sm" />
            {t("auth.change_password.error")}
          </ui.Output>
        )}
      </form>
    </section>
  );
}
