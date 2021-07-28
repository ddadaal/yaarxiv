/* eslint-disable max-len */
import { Box } from "grommet";
import React from "react";
import { api } from "src/apis";
import { prefix } from "src/i18n";
import { UserRole } from "src/models/User";
import { DashboardLayout } from "src/pageComponents/Dashboard/DashboardLayout";
import { SectionTitle } from "src/pageComponents/Dashboard/SectionTitle";
import { UserProfileForm } from "src/pageComponents/Dashboard/UserProfile/UserProfileForm";
import { ssrPage } from "src/utils/ssr";
import { DashboardGetProfileSchema } from "yaarxiv-api/api/dashboard/getProfile";

const root = prefix("pages.dashboard.information.");

interface Props {
  profile: DashboardGetProfileSchema["responses"]["200"];
}

export const ProfilePage = ssrPage<Props>(({ profile }) => {

  return (
    <DashboardLayout>
      <Box flex>
        <SectionTitle titleId={root("account.title")} />
        <UserProfileForm profile={profile} />
      </Box>
      <Box margin={{ top: "large" }} flex>
      </Box>
    </DashboardLayout>
  );
}, async () => {
  return await api.dashboard.dashboardGetProfile({})
    .then((x) => ({ profile: x }));
}, { authOptions: { roles: [UserRole.User]} });

export default ProfilePage;
