import { NextRouter, useRouter } from "next/router";
import React from "react";
import { useStore } from "simstate";
import { LocalizedString } from "simstate-i18n";
import { HttpError } from "src/apis/fetch";
import { lang } from "src/i18n";
import { UserStore } from "src/stores/UserStore";
import { useNotification } from "./useNotification";

const root = lang.components.httpHandler;

export function useHttpErrorHandler(
  setLoadingState: (b: boolean) => void,
) {

  const notification = useNotification();
  const router = useRouter();
  const userStore = useStore(UserStore);

  return async (call: () => Promise<void>) => {
    try {
      setLoadingState(true);
      const r = await call();
      setLoadingState(false);
      return r;
    } catch (e) {
      setLoadingState(false);
      const ex = e as HttpError;
      // The token is now invalid.
      // Route back to login page and show a notification.
      if (ex.status === 401) {
        router.push("/login");
        userStore.logout();
        notification.addNotification({
          level: "error",
          message: <LocalizedString id={root.tokenInvalid} />,
        });
      } else {
        notification.addNotification({
          level: "error",
          message: <LocalizedString id={root.networkError} />,
        });
      }
    }
  };

}
