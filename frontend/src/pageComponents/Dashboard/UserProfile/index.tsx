import React from "react";
import { UserStore } from "src/stores/UserStore";
import { TwoColumnLayout } from "src/layouts/TwoColumnLayout";
import { Profile } from "./Profile";
import { ChangePassword } from "./ChangePassword";
import { Box } from "grommet";
interface Props {
  userStore: ReturnType<typeof UserStore>;
}

export const UserProfile: React.FC<Props> = () => {

  return (
    <Box margin="small">
      <TwoColumnLayout
        gap="large"
        leftProportion="1/2"
        rightProportion="1/2"
        left={
          <Profile />
        }
        right={
          <ChangePassword />
        }
      >
      </TwoColumnLayout>
    </Box>
  );

};
