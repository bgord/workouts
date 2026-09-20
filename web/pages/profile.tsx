// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import * as ui from "../components";
import { rootRoute } from "../router";
import * as Sections from "../sections";

export function Profile() {
  const t = bg.useTranslations();
  const { session } = rootRoute.useLoaderData();

  return (
    <ui.Main>
      <div data-cross="center" data-main="between" data-stack="x" {...ui.Gap.related}>
        <ui.Header data-grow="1">{t("profile.header")}</ui.Header>
        <ui.Logout />
      </div>

      <div>{session.user.email}</div>

      <Sections.ProfileAvatarChange />

      <Sections.ProfileLanguageSelector />

      <Sections.ProfilePasswordChange />

      <Sections.ProfileWorkoutsExport />

      <Sections.ProfileAccountDelete />
    </ui.Main>
  );
}
