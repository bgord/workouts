import { Autocomplete, useMutation, useToggle, useTranslations } from "@bgord/ui";
import { CircleAlert, UserX } from "lucide-react";
import * as ui from "../components";

export function ProfileAccountDelete() {
  const t = useTranslations();

  const deleteAccount = useToggle({ name: "delete-account" });

  const mutation = useMutation({
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
    <section className="c-card" data-variant="flat" {...ui.Spacing.surface} {...ui.Gap.related}>
      <div data-main="between" data-md-stack="y" data-stack="x" {...ui.Gap.cluster}>
        <div data-cross="center" data-stack="x" {...ui.Gap.cluster}>
          <UserX data-color="danger-400" data-size="sm" />
          <ui.SectionHeading>{t("profile.delete_account.header")}</ui.SectionHeading>
        </div>

        <div data-color="danger-400" data-cross="center" data-fs="xs" data-stack="x" {...ui.Gap.cluster}>
          <CircleAlert data-size="sm" />
          {t("app.dialog.irreversible")}
        </div>
      </div>

      <button
        className="c-button"
        data-mr="auto"
        data-variant="destructive"
        onClick={deleteAccount.enable}
        type="button"
        {...deleteAccount.props.controller}
      >
        {t("profile.delete_account.cta_primary")}
      </button>

      <ui.Dialog {...deleteAccount}>
        <ui.DialogHeader disabled={mutation.isLoading} onClose={deleteAccount.disable}>
          {t("profile.delete_account.header")}
        </ui.DialogHeader>

        <div data-stack="y" {...ui.Gap.related}>
          <ui.DialogInfo>{t("profile.delete_account.info")}</ui.DialogInfo>
          <ui.DialogStatus variant="irreversible" />
        </div>

        <form
          aria-busy={mutation.isLoading}
          data-stack="y"
          onSubmit={mutation.handleSubmit}
          {...ui.Gap.stack}
        >
          <div data-cross="start" data-stack="y" {...ui.Gap.field}>
            <label className="c-label" htmlFor="challenge">
              {t("profile.delete_account.challenge")}
            </label>
            <input
              className="c-input"
              id="challenge"
              name="challenge"
              pattern="delete"
              placeholder={t("profile.delete_account.input.placeholder")}
              required
              title={t("profile.delete_account.challenge")}
              type="text"
              {...Autocomplete.off}
            />
          </div>

          {mutation.isError && <ui.DialogError>{t("profile.delete_account.error")}</ui.DialogError>}

          <ui.DialogFooter disabled={mutation.isLoading} onCancel={deleteAccount.disable}>
            <button
              className="c-button"
              data-variant="destructive"
              disabled={mutation.isLoading}
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
