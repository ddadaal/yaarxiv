import React, { useRef } from "react";
import { Grommet, Box } from "grommet";
import { Footer } from "src/layouts/footer";
import { Header } from "src/layouts/header";
import siteTheme from "src/styles/theme";
import NotificationSystem, { System } from "react-notification-system";
import { NotificationSystemContext } from "src/utils/useNotification";
import { MediaContextProvider } from "src/styles/media";
import { useStore } from "simstate";
import { ThemeStore } from "src/stores/ThemeStore";
import { GlobalStyle } from "src/styles/global";

interface Props {
}


export const MainLayout: React.FC<Props> = ({ children }) => {
  const notificationRef = useRef<System | null>(null);

  const { theme } = useStore(ThemeStore);

  return (
    <>
      <GlobalStyle />
      <NotificationSystem ref={notificationRef} />
      <NotificationSystemContext.Provider value={notificationRef}>
        <MediaContextProvider>
          <Grommet theme={siteTheme} full={true} themeMode={theme}>
            <Box direction="column" height="100vh">
              <Header />
              <Box as="main" flex="grow" pad="small" align="center" >
                <Box width="xlarge" flex="grow">
                  {children}
                </Box>
              </Box>
              <Footer />
            </Box>
          </Grommet>
        </MediaContextProvider>
      </NotificationSystemContext.Provider>
    </>
  );
};
