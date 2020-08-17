import React from "react";
import { Box } from "grommet";
import { useRouter } from "next/router";

export const Search: React.FC = (props) => {

  const router = useRouter();

  const query = router.query;

  return (
    <Box>
      Search {JSON.stringify(query)}
    </Box>
  );
};

export default Search;
