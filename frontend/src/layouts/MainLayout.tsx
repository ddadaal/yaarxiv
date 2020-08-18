import React, { useRef } from "react";
import { Grommet, Main, Box } from "grommet";
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
          <Box direction="column" height={{ min: "100vh" }}>
            <Header />
            <Main pad="small" flex="grow" >
              {children}
            </Main>
            <Footer />
          </Box>
        </Grommet>
      </NotificationSystemContext.Provider>
    </>
  );
};
