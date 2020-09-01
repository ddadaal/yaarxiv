import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";
import { LocalizedString } from "simstate-i18n";
import { failEvent } from "src/apis/events";
import { HttpError } from "src/apis/fetch";
import { lang } from "src/i18n";
import { useNotification } from "src/utils/useNotification";

const root = lang.components.httpHandler;

export const HttpErrorHandler: React.FC = () => {
  const router = useRouter();
  const notification = useNotification();

  const handler = useCallback(({ status, data }: HttpError) => {
    if (status === -1) {
      notification.addNotification({
        level: "error",
        message: <LocalizedString id={root.localNetworkError} />,
      });
    } else if (status === 401) {
      notification.addNotification({
        level: "error",
        message: <LocalizedString id={root.tokenInvalid} />,
      });
      router.push("/login");
    } else {
      notification.addNotification({
        level: "error",
        message: <LocalizedString id={root.networkError} />,
      });
    }
  }, [notification]);

  useEffect(() => {
    failEvent.register(handler);
    return () => failEvent.unregister(handler);
  }, []);

  return null;

};
