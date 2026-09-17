import { Autocomplete, useMutation, useToggle, useTranslations } from "@bgord/ui";
import { CircleAlert, UserX } from "lucide-react";
import {
  Dialog,
  DialogError,
  DialogFooter,
  DialogHeader,
  DialogInfo,
  DialogStatus,
  SectionHeading,
} from "../components";

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
    <section className="c-card" data-gap="4" data-p="4" data-variant="flat">
      <div data-gap="2" data-main="between" data-md-stack="y" data-stack="x">
        <div data-cross="center" data-gap="3" data-stack="x">
          <UserX data-color="danger-400" data-size="sm" />
          <SectionHeading>{t("profile.delete_account.header")}</SectionHeading>
        </div>

        <div data-color="danger-400" data-cross="center" data-fs="xs" data-gap="1" data-stack="x">
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

      <Dialog {...deleteAccount}>
        <DialogHeader disabled={mutation.isLoading} onClose={deleteAccount.disable}>
          {t("profile.delete_account.header")}
        </DialogHeader>

        <div data-gap="3" data-stack="y">
          <DialogInfo>{t("profile.delete_account.info")}</DialogInfo>
          <DialogStatus variant="irreversible" />
        </div>

        <form aria-busy={mutation.isLoading} data-gap="8" data-stack="y" onSubmit={mutation.handleSubmit}>
          <div data-cross="start" data-gap="1-5" data-stack="y">
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

          {mutation.isError && <DialogError>{t("profile.delete_account.error")}</DialogError>}

          <DialogFooter disabled={mutation.isLoading} onCancel={deleteAccount.disable}>
            <button
              className="c-button"
              data-variant="destructive"
              disabled={mutation.isLoading}
              type="submit"
            >
              {t("profile.delete_account.cta_primary")}
            </button>
          </DialogFooter>
        </form>
      </Dialog>
    </section>
  );
}
