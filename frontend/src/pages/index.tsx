import React from "react";
import Router from "next/router";
import { Box } from "grommet";
import { SearchBar } from "src/components/SearchBar";
import { Logo } from "src/components/Logo";

const Home: React.FC = () => {

  return(
    <Box justify="center" flex="grow">
      <Box justify="center" align="center" gap="medium" pad="small">
        <Box width="medium">
          <Logo />
        </Box>
        <Box width="medium">
          <SearchBar initialText="" onConfirm={(k) => Router.push({
            pathname: "/search",
            query: { searchText: k },
          })}
          />
        </Box>
        <Box height="small" />
      </Box>
    </Box>
  );
};

export default Home;
