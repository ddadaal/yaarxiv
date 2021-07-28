/* eslint-disable max-len */
import { Box } from "grommet";
import React from "react";
import { prefix } from "src/i18n";
import { DashboardLayout } from "src/pageComponents/Dashboard/DashboardLayout";
import { SectionTitle } from "src/pageComponents/Dashboard/SectionTitle";
import { UserProfileForm } from "src/pageComponents/Dashboard/UserProfile/UserProfileForm";

const root = prefix("pages.dashboard.information.");

export const ProfilePage = () => {

  return (
    <DashboardLayout>
      <Box flex>
        <SectionTitle titleId={root("account.title")} />
        <UserProfileForm />
      </Box>
      <Box margin={{ top: "large" }} flex>
      </Box>
    </DashboardLayout>
  );
};

export default ProfilePage;
