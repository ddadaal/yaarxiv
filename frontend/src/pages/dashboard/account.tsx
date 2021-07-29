/* eslint-disable max-len */
import { Box } from "grommet";
import React from "react";
import { api } from "src/apis";
import { prefix } from "src/i18n";
import { UserRole } from "src/models/User";
import { DashboardLayout } from "src/pageComponents/Dashboard/DashboardLayout";
import { SectionTitle } from "src/pageComponents/Dashboard/SectionTitle";
import { AccountInfoForm } from "src/pageComponents/Dashboard/AccountInfo/AccountInfoForm";
import { ssrPage } from "src/utils/ssr";
import { DashboardGetProfileSchema } from "yaarxiv-api/api/dashboard/getProfile";

const root = prefix("pages.dashboard.accountInfo.");

interface Props {
  profile: DashboardGetProfileSchema["responses"]["200"];
}

export const AccountInfoPage = ssrPage<Props>(({ profile }) => {

  return (
    <DashboardLayout>
      <Box flex>
        <SectionTitle titleId={root("title")} />
        <AccountInfoForm profile={profile} />
      </Box>
      <Box margin={{ top: "large" }} flex>
      </Box>
    </DashboardLayout>
  );
}, async () => {
  return await api.dashboard.dashboardGetProfile({})
    .then((x) => ({ profile: x }));
}, { authOptions: { roles: [UserRole.User]} });

export default AccountInfoPage;
