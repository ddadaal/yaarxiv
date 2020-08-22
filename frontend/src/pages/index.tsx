import React from "react";
import { useRouter } from "next/router";
import { Box } from "grommet";
import { SearchBar } from "src/components/SearchBar";
import { Logo } from "src/components/Logo";

const Home: React.FC = () => {

  const router = useRouter();

  return(
    <Box direction="column" justify="center" align="center" flex="grow">
      <Box justify="center" align="center" gap="medium" pad="small">
        <Box>
          <Logo style={{ height: "120px", width: "auto" }} />
        </Box>
        <SearchBar initialText="" onConfirm={(k) => router.push({
          pathname: "/search",
          query: { searchText: k },
        })}
        />
        <Box height="small" />
      </Box>
    </Box>
  );
};

export default Home;
