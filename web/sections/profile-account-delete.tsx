import * as bg from "@bgord/ui";
import { ArrowRight, UserX } from "lucide-react";
import * as ui from "../components";

export function ProfileAccountDelete() {
  const t = bg.useTranslations();

  const deleteAccount = bg.useToggle({ name: "delete-account" });

  const challenge = bg.useTextField({ name: "challenge" });

  const mutation = bg.useMutation({
    perform: () =>
      fetch("/api/auth/delete-user", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }),
    onSuccess: () => window.location.replace("/public/login.html"),
  });

  return (
    <section
      className="c-card"
      data-cross="center"
      data-main="between"
      data-stack="x"
      data-tone="danger"
      data-variant="flat"
      {...ui.Spacing.surface}
      {...ui.Gap.related}
    >
      <div data-cross="center" data-stack="x" {...ui.Gap.cluster}>
        <UserX data-color="danger-400" data-size="sm" />
        <ui.SectionHeading>{t("profile.delete_account.header")}</ui.SectionHeading>
      </div>

      <button
        className="c-button"
        data-shrink="0"
        data-tone="danger"
        data-variant="ghost"
        onClick={deleteAccount.enable}
        type="button"
        {...deleteAccount.props.controller}
      >
        {t("profile.delete_account.cta_secondary")}
        <ArrowRight data-size="sm" />
      </button>

      <ui.Dialog {...deleteAccount}>
        <ui.DialogHeader disabled={mutation.isLoading} onClose={deleteAccount.disable}>
          {t("profile.delete_account.header")}
        </ui.DialogHeader>

        <ui.DialogBody>
          <ui.DialogInfo>{t("profile.delete_account.info")}</ui.DialogInfo>
          <ui.DialogStatus variant="irreversible" />
        </ui.DialogBody>

        <form
          aria-busy={mutation.isLoading}
          data-stack="y"
          onSubmit={mutation.handleSubmit}
          {...ui.Gap.stack}
        >
          <div data-cross="start" data-stack="y" {...ui.Gap.field}>
            <label className="c-label" {...challenge.label.props}>
              {t("profile.delete_account.challenge")}
            </label>
            <input
              className="c-input"
              pattern="delete"
              placeholder={t("profile.delete_account.input.placeholder")}
              required
              title={t("profile.delete_account.challenge")}
              {...bg.Autocomplete.off}
              {...challenge.input.props}
            />
          </div>

          {mutation.isError && <ui.DialogError>{t("profile.delete_account.error")}</ui.DialogError>}

          <ui.DialogFooter disabled={mutation.isLoading} onCancel={deleteAccount.disable}>
            <button
              className="c-button"
              data-variant="destructive"
              disabled={challenge.value !== "delete" || mutation.isLoading}
              type="submit"
            >
              {t("profile.delete_account.cta_primary")}
            </button>
          </ui.DialogFooter>
        </form>
      </ui.Dialog>
    </section>
  );
}
