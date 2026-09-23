// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import * as ui from "../components";
import { rootRoute } from "../router";
import { ProfileAccountDelete } from "../sections/profile-account-delete";
import { ProfileAvatarChange } from "../sections/profile-avatar-change";
import { ProfileLanguageSelector } from "../sections/profile-language-selector";
import { ProfilePasswordChange } from "../sections/profile-password-change";
import { ProfileWeeklySummary } from "../sections/profile-weekly-summary";
import { ProfileWorkoutsExport } from "../sections/profile-workouts-export";

export function Profile() {
  const t = bg.useTranslations();
  const { session } = rootRoute.useLoaderData();

  return (
    <ui.Main>
      <div data-main="between" data-stack="x" {...ui.Gap.related}>
        <ui.Header data-grow="1">{t("profile.header")}</ui.Header>
        <ui.Logout />
      </div>

      <div>{session.user.email}</div>

      <ProfileAvatarChange />

      <ProfileLanguageSelector />

      <ProfileWeeklySummary />

      <ProfilePasswordChange />

      <ProfileWorkoutsExport />

      <ProfileAccountDelete />
    </ui.Main>
  );
}
