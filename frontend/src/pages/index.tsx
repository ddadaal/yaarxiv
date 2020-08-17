import React from "react";
import { SearchBar } from "src/components/SearchBar";
import { useRouter } from "next/router";
import { Box } from "grommet";


const Home: React.FC = () => {

  return(
    <Box direction="column" justify="center" align="center" flex="grow">
      <Box >
        yaarxiv
      </Box>
      <Box alignSelf="center">
        <SearchBar  />
      </Box>
    </Box>
  );
};

export default Home;
