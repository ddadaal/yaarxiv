import React from "react";
import { Grommet, Main } from "grommet";
import { Footer } from "src/layouts/footer";
import { Header } from "src/layouts/header";
import theme from "src/styles/theme";

export const MainLayout: React.FC = ({ children }) => {
  return (
    <Grommet theme={theme}>
      <Header />
      <Main pad="small">
        {children}
      </Main>
      <Footer />
    </Grommet>
  );
};
