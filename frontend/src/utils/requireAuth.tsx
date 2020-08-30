import React from "react";
import { useStore } from "simstate";
import { UserStore } from "src/stores/UserStore";
import { UserRole } from "src/models/User";
import { Forbidden } from "src/components/errors/Forbidden";
import { NotAuthorized } from "src/components/errors/NotAuthorized";


interface Props {
  roles?: UserRole[];
}

export interface RequireAuthProps {
  userStore: ReturnType<typeof UserStore>;
}

export const requireAuth = (props: Props) =>
  <CP extends {}>(Component: React.ComponentType<RequireAuthProps & CP>) => (cp) => {
    const userStore = useStore(UserStore);

    if (!userStore.loggedIn) {
      return <NotAuthorized />;
    }

    if (props.roles && !props.roles.includes(userStore.user!.role)) {
      return <Forbidden />;
    }

    return <Component userStore={userStore} {...cp} />;
  };
