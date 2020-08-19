import React from "react";
import { SearchBar } from "src/components/SearchBar";
import { useRouter } from "next/router";
import { Box } from "grommet";


const Home: React.FC = () => {

  const router = useRouter();

  return(
    <Box direction="column" justify="center" align="center" flex="grow">
      <Box >
        yaarxiv
      </Box>
      <Box alignSelf="center">
        <SearchBar initialText="" onConfirm={(k) => router.push({
          pathname: "/search",
          query: { searchText: k },
        })}
        />
      </Box>
    </Box>
  );
};

export default Home;
