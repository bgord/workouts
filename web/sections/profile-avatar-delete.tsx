import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { X } from "lucide-react";
import * as ui from "../components";
import { rootRoute } from "../router";

export function ProfileAvatarDelete() {
  const t = bg.useTranslations();
  const router = useRouter();
  const { avatarEtag } = rootRoute.useLoaderData();

  const profileAvatarDelete = bg.useToggle({ name: "profile-avatar-delete" });

  const enabled = avatarEtag !== null;

  const mutation = bg.useMutation({
    perform: () => fetch("/api/preferences/profile-avatar", { method: "DELETE", credentials: "include" }),
    onSuccess: () => router.invalidate({ filter: () => true, sync: true }),
  });

  return (
    <div aria-busy={mutation.isLoading} data-position="relative" data-self="start">
      <button
        data-cursor="pointer"
        data-disp="block"
        disabled={!enabled}
        onClick={profileAvatarDelete.toggle}
        type="button"
        {...profileAvatarDelete.props.controller}
      >
        <ui.Avatar size={ui.AvatarSize.lg} />
      </button>

      {profileAvatarDelete.on && (
        <>
          <div
            data-bg="neutral-900"
            data-br="md"
            data-inset="0"
            data-opacity="high"
            data-position="absolute"
          />

          <ui.IconButton
            aria-label={t("profile.avatar.delete.title")}
            data-left="5"
            data-position="absolute"
            data-right="5"
            data-top="8"
            disabled={mutation.isLoading}
            onClick={() => mutation.mutate()}
            title={t("profile.avatar.delete.title")}
            tone="danger"
            {...profileAvatarDelete.props.target}
          >
            <X data-size="md" />
          </ui.IconButton>
        </>
      )}
    </div>
  );
}
