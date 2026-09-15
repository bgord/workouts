import { useMutation, useToggle, useTranslations } from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { X } from "lucide-react";
import { Avatar, AvatarSize } from "../components";
import { rootRoute } from "../router";

export function ProfileAvatarDelete() {
  const t = useTranslations();
  const router = useRouter();
  const { avatarEtag } = rootRoute.useLoaderData();
  const overlay = useToggle({ name: "profile-avatar-delete" });

  const enabled = avatarEtag !== null;

  const mutation = useMutation({
    perform: () => fetch("/api/preferences/profile-avatar", { method: "DELETE", credentials: "include" }),
    onSuccess: () => router.invalidate({ filter: () => true, sync: true }),
  });

  return (
    <div data-position="relative" data-self="start">
      <button data-cursor="pointer" data-disp="block" onClick={overlay.toggle} type="button">
        <Avatar size={AvatarSize.lg} />
      </button>

      {overlay.on && enabled && (
        <div data-bg="neutral-900" data-br="md" data-inset="0" data-opacity="high" data-position="absolute" />
      )}
      {overlay.on && enabled && (
        <button
          className="c-button"
          data-color="neutral-200"
          data-hover-color="danger-400"
          data-left="5"
          data-position="absolute"
          data-right="5"
          data-top="8"
          data-variant="ghost"
          disabled={mutation.isLoading}
          onClick={() => mutation.mutate()}
          title={t("profile.avatar.delete.title")}
          type="button"
        >
          <X data-size="md" />
        </button>
      )}
    </div>
  );
}
