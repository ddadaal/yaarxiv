import { Box, Heading, Paragraph } from "grommet";
import { Lock } from "grommet-icons";
import React from "react";
import { useStore } from "simstate";
import { LocalizedString } from "simstate-i18n";
import { lang } from "src/i18n";
import { UserStore } from "src/stores/UserStore";

const root = lang.components.requireAuth;

interface Props {

}

export interface RequireAuthProps {
  userStore: ReturnType<typeof UserStore>;
}

export const requireAuth = () =>
  (Component: React.ComponentType<RequireAuthProps>) => () => {
    const userStore = useStore(UserStore);

    if (!userStore.loggedIn) {
      return (
        <Box justify="center" align="center">
          <Heading level={1} size="small">
            <Lock color="status-error" />
            <LocalizedString id={root.title} />
          </Heading>
          <Paragraph>
            <LocalizedString
              id={root.description}
            />
          </Paragraph>
        </Box>
      );
    } else {
      return <Component userStore={userStore} />;
    }
  };
