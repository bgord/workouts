import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, CircleUser, FileImage, ImageUp, X } from "lucide-react";
import * as ui from "../components";
import { ProfileAvatarDelete } from "./profile-avatar-delete";

const mimeTypes = ["image/png", "image/jpeg", "image/webp"];
const maxSizeBytes = 10_000_000;

export function ProfileAvatarChange() {
  const router = useRouter();
  const t = bg.useTranslations();

  const profileAvatarChange = bg.useToggle({ name: "profile-avatar-change" });
  const avatar = bg.useFile("avatar", { mimeTypes, maxSizeBytes });

  const mutation = bg.useMutation({
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
      profileAvatarChange.disable();
      avatar.actions.clearFile();
      await router.invalidate({ filter: () => true, sync: true });
    },
  });

  return (
    <section className="c-card" data-variant="flat" {...ui.Spacing.surface} {...ui.Gap.related}>
      <div data-stack="x" {...ui.Gap.cluster}>
        <CircleUser data-color="neutral-400" data-size="sm" />
        <ui.SectionHeading>{t("profile.avatar.header")}</ui.SectionHeading>
      </div>

      <div data-cross="start" data-stack="y" {...ui.Gap.related}>
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
            aria-busy={mutation.isLoading}
            data-md-width="100%"
            data-stack="y"
            encType="multipart/form-data"
            onSubmit={mutation.handleSubmit}
            {...ui.Gap.cluster}
            {...profileAvatarChange.props.target}
          >
            <div data-stack="x" {...ui.Gap.inline}>
              <ui.FileButton data-md-grow="1" file={avatar}>
                {avatar.isSelected ? (
                  <FileImage data-color="neutral-400" data-shrink="0" data-size="sm" />
                ) : (
                  <ImageUp data-shrink="0" data-size="sm" />
                )}

                <span data-transform="truncate">
                  {avatar.isSelected ? avatar.data.name : t("profile.avatar.select_file.cta")}
                </span>

                <ui.DropzoneInput file={avatar} />
              </ui.FileButton>

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
                onClick={bg.exec([avatar.actions.clearFile, mutation.reset, profileAvatarChange.disable])}
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
