import { Box, Heading, Paragraph } from "grommet";
import { Lock } from "grommet-icons";
import React from "react";
import { useStore } from "simstate";
import { LocalizedString } from "simstate-i18n";
import { lang } from "src/i18n";
import { UserStore } from "src/stores/UserStore";
import { UserRole } from "src/models/User";

const root = lang.components.requireAuth;

interface Props {
  roles?: UserRole[];
}

export interface RequireAuthProps {
  userStore: ReturnType<typeof UserStore>;
}

export const requireAuth = (props: Props) =>
  (Component: React.ComponentType<RequireAuthProps>) => () => {
    const userStore = useStore(UserStore);

    // auth
    const authenticated = userStore.loggedIn
      && (!props.roles || props.roles.includes(userStore.user!.role));

    if (!authenticated) {
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
