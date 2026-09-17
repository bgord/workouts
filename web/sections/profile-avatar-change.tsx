import { exec, useFile, useMutation, useToggle, useTranslations } from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, CircleUser, FileImage, ImageUp, X } from "lucide-react";
import * as ui from "../components";
import { ProfileAvatarDelete } from "./profile-avatar-delete";

const mimeTypes = ["image/png", "image/jpeg", "image/webp"];
const label = { minWidth: 0 };

export function ProfileAvatarChange() {
  const router = useRouter();
  const t = useTranslations();

  const profileAvatarChange = useToggle({ name: "profile-avatar-change" });
  const avatar = useFile("avatar", { mimeTypes, maxSizeBytes: 10_000_000 });

  const mutation = useMutation({
    perform: () => {
      const form = new FormData();

      if (avatar.data) form.append("file", avatar.data);

      return fetch("/api/preferences/profile-avatar/update", {
        method: "POST",
        body: form,
        credentials: "include",
      });
    },
    onSuccess: async () => {
      await router.invalidate({ filter: () => true, sync: true });
      avatar.actions.clearFile();
      profileAvatarChange.disable();
    },
  });

  return (
    <section className="c-card" data-variant="flat" {...ui.Spacing.surface} {...ui.Spacing.related}>
      <div data-cross="center" data-stack="x" {...ui.Spacing.cluster}>
        <CircleUser data-color="neutral-400" data-size="sm" />
        <ui.SectionHeading>{t("profile.avatar.header")}</ui.SectionHeading>
      </div>

      <div
        data-cross="start"
        data-md-self={profileAvatarChange.on ? "stretch" : undefined}
        data-self="start"
        data-stack="y"
        {...ui.Spacing.related}
      >
        <ProfileAvatarDelete />

        {profileAvatarChange.off && (
          <button
            className="c-button"
            data-fs="xs"
            data-variant="ghost"
            onClick={profileAvatarChange.enable}
            type="button"
            {...profileAvatarChange.props.controller}
          >
            <ImageUp data-size="sm" />
            {t("profile.avatar.change.cta")}
          </button>
        )}

        {profileAvatarChange.on && (
          <form
            data-md-width="100%"
            data-stack="y"
            encType="multipart/form-data"
            onSubmit={mutation.handleSubmit}
            {...ui.Spacing.cluster}
            {...profileAvatarChange.props.target}
          >
            <div data-cross="center" data-stack="x" data-wrap="nowrap" {...ui.Spacing.inline}>
              <label
                className="c-button"
                data-cross="center"
                data-disp="flex"
                data-main="center"
                data-md-grow="1"
                data-variant="secondary"
                data-wrap="nowrap"
                style={label}
                tabIndex={0}
                {...ui.Spacing.cluster}
                {...avatar.label.props}
              >
                {avatar.isSelected ? (
                  <FileImage data-color="neutral-400" data-shrink="0" data-size="sm" />
                ) : (
                  <ImageUp data-shrink="0" data-size="sm" />
                )}

                <span data-transform="truncate">
                  {avatar.isSelected ? avatar.data.name : t("profile.avatar.select_file.cta")}
                </span>

                <input
                  className="c-visually-hidden"
                  disabled={avatar.isSelected}
                  onChange={avatar.actions.selectFile}
                  required
                  type="file"
                  {...avatar.input.props}
                />
              </label>

              <ui.IconButton
                aria-label={t("app.save")}
                disabled={!avatar.isSelected || mutation.isLoading}
                title={t("app.save")}
                tone="positive"
                type="submit"
              >
                <Check data-size="sm" />
              </ui.IconButton>

              <ui.IconButton
                aria-label={t("app.cancel")}
                onClick={exec([avatar.actions.clearFile, mutation.reset, profileAvatarChange.disable])}
                title={t("app.cancel")}
              >
                <X data-size="sm" />
              </ui.IconButton>
            </div>

            <ui.Meta>{t("profile.avatar.hint")}</ui.Meta>

            {mutation.isError && <ui.Output>{t("profile.avatar.upload.error")}</ui.Output>}
          </form>
        )}
      </div>
    </section>
  );
}
