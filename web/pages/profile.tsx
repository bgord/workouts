// fallow-ignore-file unused-export
import { useTranslations } from "@bgord/ui";
import * as ui from "../components";
import { rootRoute } from "../router";
import {
  ProfileAccountDelete,
  ProfileAvatarChange,
  ProfileLanguageSelector,
  ProfilePasswordChange,
  ProfileWorkoutsExport,
} from "../sections";

export function Profile() {
  const t = useTranslations();
  const { session } = rootRoute.useLoaderData();

  return (
    <ui.Main>
      <div data-cross="center" data-stack="x" {...ui.Spacing.related}>
        <ui.Header data-grow="1">{t("profile.header")}</ui.Header>

        <div data-color="neutral-500" data-fs="sm" data-transform="truncate">
          {session.user.email}
        </div>
      </div>

      <ProfileAvatarChange />

      <ProfileLanguageSelector />

      <ProfilePasswordChange />

      <ProfileWorkoutsExport />

      <ProfileAccountDelete />
    </ui.Main>
  );
}
