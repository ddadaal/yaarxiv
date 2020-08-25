import { useNotification } from "./useNotification";

export function useHttpErrorHandler<TResponse>(
  setLoadingState: (b: boolean) => void,
) {

  const notification = useNotification();

  return async (call: () => Promise<void>) => {

    try {
      setLoadingState(true);
      const r = await call();
      return r;
    } catch (e) {
      notification.addNotification({
        level: "error",
        message: "Some network error is detected. Please retry.",
      });
    } finally {
      setLoadingState(false);
    }
  };

}
