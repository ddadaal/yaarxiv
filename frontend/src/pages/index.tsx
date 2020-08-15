import React from "react";
import Head from "next/head";
import { Grommet, Box } from "grommet";

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
  return(
    <Grommet theme={theme}>
      <AppBar>Hello Grommet!</AppBar>
    </Grommet>
  );
};

export default Home;
