/* eslint-disable max-len */
import { Box, Heading } from "grommet";
import React from "react";
import { Localized, prefix } from "src/i18n";
import { TwoColumnLayout } from "src/layouts/TwoColumnLayout";
import { DashboardLayout } from "src/pageComponents/Dashboard/DashboardLayout";
import { ChangePasswordForm } from "src/pageComponents/Dashboard/UserProfile/ChangePasswordForm";
import { UserProfileForm } from "src/pageComponents/Dashboard/UserProfile/UserProfileForm";

const root = prefix("pages.dashboard.");

export const ProfilePage = () => {

  return (
    <DashboardLayout>
      <Box>
        <Heading level={1}>
          <Localized id={root("profile.title")} />
        </Heading>
        <Box margin="small">
          <TwoColumnLayout
            gap="large"
            leftProportion="1/2"
            rightProportion="1/2"
            left={
              <UserProfileForm />
            }
            right={
              <ChangePasswordForm />
            }
          >
          </TwoColumnLayout>
        </Box>
      </Box>
    </DashboardLayout>
  );
};

export default ProfilePage;
