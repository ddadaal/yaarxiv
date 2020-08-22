import React, { useRef } from "react";
import { Grommet, Main, Box } from "grommet";
import { Footer } from "src/layouts/footer";
import { Header } from "src/layouts/header";
import siteTheme from "src/styles/theme";
import NotificationSystem, { System } from "react-notification-system";
import { NotificationSystemContext } from "src/components/useNotification";
import { MediaContextProvider } from "src/styles/media";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useStore } from "simstate";
import { ThemeStore } from "src/stores/ThemeStore";

interface Props {
}

export const MainLayout: React.FC<Props> = ({ children }) => {
  const notificationRef = useRef<System | null>(null);

  const { theme } = useStore(ThemeStore);

  return (
    <>
      <NotificationSystem ref={notificationRef} />
      <NotificationSystemContext.Provider value={notificationRef}>
        <MediaContextProvider>
          <Grommet theme={siteTheme} full={true} themeMode={theme}>
            <Box direction="column" height={{ min: "100vh" }}>
              <Header />
              <Main pad="small" flex="grow" >
                {children}
              </Main>
              <Footer />
            </Box>
          </Grommet>
        </MediaContextProvider>
      </NotificationSystemContext.Provider>
    </>
  );
};
