import React, { useEffect } from "react";
import { Grommet, Box } from "grommet";
import { StoreProvider } from "simstate";
import useConstant from "src/utils/useConstant";
import { createI18nStore } from "simstate-i18n";
import { i18nContext } from "src/i18n";
import { getApiService } from "src/apis";
import { homeApis } from "src/apis/home";

const theme = {
  global: {
    font: {
      family: "Roboto",
      size: "18px",
      height: "20px",
    },
  },
};

const AppBar: React.FC = ({ children }) => (
  <Box
    tag='header'
    direction='row'
    align='center'
    justify='between'
    background='brand'
    pad={{ left: "medium", right: "small", vertical: "small" }}
    elevation='medium'
    style={{ zIndex: 1 }}
  >
    {children}
  </Box>
);

const Home: React.FC = () => {

  const i18nStore  = useConstant(() => createI18nStore(i18nContext));

  const api = getApiService(homeApis);

  useEffect(() => {
    api.login({ username: "123", password: "123" }, undefined);
  });

  return(
    <StoreProvider stores={[i18nStore]}>
      <Grommet theme={theme}>
        <AppBar>Hello Grommet!</AppBar>
      </Grommet>
    </StoreProvider>
  );
};

export default Home;
