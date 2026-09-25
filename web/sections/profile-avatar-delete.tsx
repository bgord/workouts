import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import * as ui from "../components";
import { rootRoute } from "../router";

export function ProfileAvatarDelete() {
  const t = bg.useTranslations();
  const router = useRouter();
  const { avatarEtag } = rootRoute.useLoaderData();

  const enabled = avatarEtag !== null;

  const mutation = bg.useMutation({
    perform: () => fetch("/api/preferences/profile-avatar", { method: "DELETE", credentials: "include" }),
    onSuccess: () => router.invalidate({ filter: () => true, sync: true }),
  });

  if (!enabled) return null;

  return (
    <ui.IconButton
      aria-busy={mutation.isLoading}
      aria-label={t("profile.avatar.delete.title")}
      data-bg="danger-900"
      data-bottom="0"
      data-br="circle"
      data-color="danger-400"
      data-position="absolute"
      data-right="0"
      disabled={mutation.isLoading}
      onClick={() => mutation.mutate()}
      title={t("profile.avatar.delete.title")}
    >
      <Trash2 data-size="xs" />
    </ui.IconButton>
  );
}
