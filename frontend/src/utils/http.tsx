import Router from "next/router";
import { toast } from "react-toastify";
import { useStore } from "simstate";
import { Localized, prefix } from "src/i18n";
import { HttpError } from "src/apis/fetch";
import { UserStore } from "src/stores/UserStore";

const root = prefix("components.httpHandler.");


export async function handleTokenInvalid(
  userStore: ReturnType<typeof UserStore>,
) {
  toast.error(
    <Localized id={root("tokenInvalid")} />,
  );

  await Router.push("/login");
  userStore.logout();
}

export function useInvalidTokenHandler() {
  const userStore = useStore(UserStore);

  return () => handleTokenInvalid(userStore);
}

export function handleHttpError(
  e: HttpError,
  userStore: ReturnType<typeof UserStore>,
) {
  if (process.env.NODE_ENV === "development") {
    console.log(e);
  }
  if (e.status === -1) {
    toast.error(
      <Localized id={root("networkError")} />,
    );

  } else if (e.status === 401) {
    // Route back to login page and show a notification.
    handleTokenInvalid(userStore);
  } else {
    toast.error(
      <Localized id={root("serverError")} />,
    );
  }
}

export function useHttpErrorHandler() {
  const userStore = useStore(UserStore);

  return (e: Error) => handleHttpError(e as any as HttpError, userStore);
}


export function useHttpRequest(
  setLoadingState: (b: boolean) => void,
) {
  const userStore = useStore(UserStore);

  return async (call: (args: {
    userStore: ReturnType<typeof UserStore>,
  }) => Promise<void>) => {
    try {
      setLoadingState(true);
      return await call({ userStore });
    } catch (e) {
      if (e.name !== "AbortError") {
        handleHttpError(e, userStore);
      }
    } finally {
      setLoadingState(false);
    }
  };

}
