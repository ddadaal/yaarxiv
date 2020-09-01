import React, { useEffect } from "react";
import { HttpError } from "src/apis/fetch";
import { lang } from "src/i18n";
import { ErrorPage } from "./ErrorPage";
import { Alert } from "grommet-icons";
import Router from "next/router";
import { useStore } from "simstate";
import { LocalizedString } from "simstate-i18n";
import { UserStore } from "src/stores/UserStore";
import { useNotification } from "src/utils/useNotification";

const root = lang.components.errors;

interface Props {
  error: HttpError;
}

export const ServerError: React.FC<Props> = ({ error }) => {
  const notification = useNotification();
  const userStore = useStore(UserStore);

  useEffect(() => {
    // The token is now invalid.
    // Route back to login page and show a notification.
    if (error.status === 401) {
      Router.push("/login");
      userStore.logout();
      notification.addNotification({
        level: "error",
        message: <LocalizedString id={lang.components.httpHandler.tokenInvalid} />,
      });
    }
  }, [error.status]);

  return (
    <ErrorPage
      titleId={root.serverError.title}
      descriptionId={root.serverError.description}
      Icon={Alert}
    >
      {JSON.stringify(error)}
    </ErrorPage>
  );
};
