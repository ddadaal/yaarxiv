import { System } from "react-notification-system";
import { createContext, useContext, Ref, RefObject } from "react";

export const NotificationSystemContext = createContext<RefObject<System> | undefined>(
  undefined
);

export function useNotification(): System {
  return useContext(NotificationSystemContext)!.current!;
}
