import Router from "next/router";
import React from "react";
import { useStore } from "simstate";
import { LocalizedString } from "simstate-i18n";
import { HttpError } from "src/apis/fetch";
import { lang } from "src/i18n";
import { UserStore } from "src/stores/UserStore";
import { NotificationActions, useNotification } from "./useNotification";

const root = lang.components.httpHandler;


export async function handleTokenInvalid(
  userStore: ReturnType<typeof UserStore>,
  notification: NotificationActions
) {
  notification.addNotification({
    level: "error",
    message: <LocalizedString id={root.tokenInvalid} />,
  });
  await Router.push("/login");
  userStore.logout();
}

export function useInvalidTokenHandler() {
  const notification = useNotification();
  const userStore = useStore(UserStore);

  return () => handleTokenInvalid(userStore, notification);
}

export function handleHttpError(
  e: HttpError,
  notification: NotificationActions,
  userStore: ReturnType<typeof UserStore>,
) {
  if (process.env.NODE_ENV === "development") {
    console.log(e);
  }
  if (e.status === -1) {
    notification.addNotification({
      level: "error",
      message: <LocalizedString id={root.networkError} />,
    });
  } else if (e.status === 401) {
    // Route back to login page and show a notification.
    handleTokenInvalid(userStore, notification);
  } else {
    notification.addNotification({
      level: "error",
      message: <LocalizedString id={root.serverError} />,
    });
  }
}

export function useHttpErrorHandler() {
  const notification = useNotification();
  const userStore = useStore(UserStore);

  return (e: Error) => handleHttpError(e as any as HttpError, notification, userStore);
}


export function useHttpRequest(
  setLoadingState: (b: boolean) => void,
) {

  const notification = useNotification();
  const userStore = useStore(UserStore);

  return async (call: (args: {
    notification: NotificationActions,
    userStore: ReturnType<typeof UserStore>,
  }) => Promise<void>) => {
    try {
      setLoadingState(true);
      return await call({ notification, userStore });
    } catch (e) {
      handleHttpError(e, notification, userStore);
    } finally {
      setLoadingState(false);
    }
  };

}
