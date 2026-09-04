// fallow-ignore-file unused-export
import { useTranslations } from "@bgord/ui";
import { Separator } from "../components";
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
    <main
      data-bg="neutral-900"
      data-br="md"
      data-gap="6"
      data-maxw="md"
      data-md-mt="2"
      data-md-pb="16"
      data-md-px="3"
      data-mt="8"
      data-mx="auto"
      data-p="8"
      data-pt="6"
      data-stack="y"
      data-width="100%"
    >
      <header data-main="between" data-stack="x">
        <h2
          data-color="neutral-400"
          data-fs="xs"
          data-fw="bold"
          data-lh="none"
          data-ls="widest"
          data-transform="uppercase"
        >
          {t("profile.header")}
        </h2>
        <div data-fs="sm">{session.user.email}</div>
      </header>
      <Separator />
      <ProfileAvatarChange />
      <Separator />
      <ProfileLanguageSelector />
      <Separator />
      <ProfilePasswordChange />
      <Separator />
      <ProfileAccountDelete />
    </main>
  );
}
