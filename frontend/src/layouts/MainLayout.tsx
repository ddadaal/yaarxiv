import React from "react";
import { Grommet, Box } from "grommet";
import { Footer } from "src/layouts/footer";
import { Header } from "src/layouts/header";
import siteTheme from "src/styles/theme";
import { MediaContextProvider } from "src/styles/media";
import { useStore } from "simstate";
import { ThemeStore } from "src/stores/ThemeStore";
import { GlobalStyle } from "src/styles/global";
import { ToastContainer } from "react-toastify";

interface Props {
}

const maxWidth = "xxlarge";

export const MainLayout: React.FC<Props> = ({ children }) => {
  const { theme } = useStore(ThemeStore);

  return (
    <>
      <GlobalStyle />
      <ToastContainer />
      <MediaContextProvider>
        <Grommet theme={siteTheme} full={true} themeMode={theme}>
          <Box direction="column" height="100vh">
            <Header width={maxWidth} />
            <Box as="main" flex="grow" pad="small" align="center" >
              <Box width={maxWidth} flex="grow">
                {children}
              </Box>
            </Box>
            <Footer />
          </Box>
        </Grommet>
      </MediaContextProvider>
    </>
  );
};
