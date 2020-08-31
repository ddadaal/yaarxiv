import { System, Notification } from "react-notification-system";
import { createContext, useContext, Ref, RefObject } from "react";

export const NotificationSystemContext = createContext<RefObject<System> | undefined>(
  undefined
);

export interface NotificationActions {
  addNotification(notification: Notification): Notification;
  removeNotification(uidOrNotification: number | string | Notification): void;
  clearNotifications(): void;
  editNotification(
    uidOrNotification: number | string | Notification,
    newNotification: Notification
  ): void;
}

export function useNotification(): NotificationActions {
  const system = useContext(NotificationSystemContext)!.current!;

  return {
    ...system,
    addNotification: (arg) => system.addNotification({
      ...arg,
      position: "tc",
    }),
  };
}
