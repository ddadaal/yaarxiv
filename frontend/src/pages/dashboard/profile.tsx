/* eslint-disable max-len */
import { Box } from "grommet";
import { api } from "src/apis";
import { prefix } from "src/i18n";
import { UserRole } from "src/models/User";
import { DashboardLayout } from "src/pageComponents/Dashboard/DashboardLayout";
import { SectionTitle } from "src/pageComponents/Dashboard/SectionTitle";
import { ssrPage } from "src/utils/ssr";
import { Profile } from "yaarxiv-api/api/dashboard/model";
import { ProfileForm } from "src/pageComponents/Dashboard/Profile/ProfileForm";

const root = prefix("pages.dashboard.profile.");

interface Props {
  profile: Profile;
}

export const ProfilePage = ssrPage<Props>(({ profile }) => {

  return (
    <DashboardLayout titleId={root("title")}>
      <Box flex>
        <SectionTitle titleId={root("title")} />
        <ProfileForm profile={profile} />
      </Box>
    </DashboardLayout>
  );
}, async () => {
  return await api.dashboard.getProfile({})
    .then((x) => ({ profile: x }));
}, { authOptions: { roles: [UserRole.User]} });

export default ProfilePage;
