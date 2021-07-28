/* eslint-disable max-len */
import { Box } from "grommet";
import React from "react";
import { prefix } from "src/i18n";
import { LimitedWidthPage } from "src/layouts/LimitedWidthPage";
import { DashboardLayout } from "src/pageComponents/Dashboard/DashboardLayout";
import { SectionTitle } from "src/pageComponents/Dashboard/SectionTitle";
import { ChangePasswordForm } from "src/pageComponents/Dashboard/UserProfile/ChangePasswordForm";
import { UserProfileForm } from "src/pageComponents/Dashboard/UserProfile/UserProfileForm";

const root = prefix("pages.dashboard.information.");

export const ProfilePage = () => {

  return (
    <DashboardLayout>
      <LimitedWidthPage maxWidth="large">
        <Box margin="small" flex>
          <SectionTitle titleId={root("account.title")} />
          <UserProfileForm />
        </Box>
        <Box margin="small" flex>
          <SectionTitle titleId={root("changePassword.title")} />
          <ChangePasswordForm />
        </Box>
      </LimitedWidthPage>
    </DashboardLayout>
  );
};

export default ProfilePage;
