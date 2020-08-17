import React, { useRef } from "react";
import { Grommet, Main } from "grommet";
import { Footer } from "src/layouts/footer";
import { Header } from "src/layouts/header";
import theme from "src/styles/theme";
import NotificationSystem, { System } from "react-notification-system";
import { NotificationSystemContext } from "src/components/useNotification";

export const MainLayout: React.FC = ({ children }) => {
  const notificationRef = useRef<System>();

  return (
    <>
      <NotificationSystem ref={notificationRef} />
      <NotificationSystemContext.Provider value={notificationRef}>
        <Grommet theme={theme} full={true}>
          <Header />
          <Main pad="small">
            {children}
          </Main>
          <Footer />
        </Grommet>
      </NotificationSystemContext.Provider>
    </>
  );
};
