// fallow-ignore-file unused-export
import { useTranslations } from "@bgord/ui";
import { Header, Main } from "../components";
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
    <Main>
      <div data-cross="center" data-gap="3" data-stack="x">
        <Header data-grow="1">{t("profile.header")}</Header>

        <div data-color="neutral-500" data-fs="sm" data-transform="truncate">
          {session.user.email}
        </div>
      </div>

      <ProfileAvatarChange />

      <ProfileLanguageSelector />

      <ProfilePasswordChange />

      <ProfileWorkoutsExport />

      <ProfileAccountDelete />
    </Main>
  );
}
