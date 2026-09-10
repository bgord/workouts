// fallow-ignore-file unused-export
import { useTranslations } from "@bgord/ui";
import { Main } from "../components";
import { rootRoute } from "../router";
import {
  ProfileAccountDelete,
  ProfileAvatarChange,
  ProfileLanguageSelector,
  ProfilePasswordChange,
} from "../sections";

export function Profile() {
  const t = useTranslations();
  const { session } = rootRoute.useLoaderData();

  return (
    <Main>
      <div data-cross="center" data-gap="3" data-stack="x">
        <h1 data-color="neutral-0" data-fs="2xl" data-fw="black" data-grow="1" data-md-fs="xl">
          {t("profile.header")}
        </h1>

        <div data-color="neutral-500" data-fs="sm" data-transform="truncate">
          {session.user.email}
        </div>
      </div>

      <ProfileAvatarChange />

      <ProfileLanguageSelector />

      <ProfilePasswordChange />

      <ProfileAccountDelete />
    </Main>
  );
}
