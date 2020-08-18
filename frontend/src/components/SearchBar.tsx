import React, { useState, useCallback, useMemo } from "react";
import { TextInput, Box, Button } from "grommet";
import { Search } from "grommet-icons";
import { AnchorLink } from "./AnchorLink";
import Link from "next/link";
import { constructSearchString, SearchQuery } from "src/models/SearchQuery";

interface Props {
  query?: SearchQuery;
}

export const SearchBar: React.FC<Props> = ({ query }) => {

  const [value, setValue] = useState(query?.searchText ?? "");
  const onChange = useCallback((e) => {
    setValue(e.target.value);
  }, [setValue]);

  return (
    <Box
      width="medium"
      direction="row"
      align="center"
      round="small"
      border
    >
      <TextInput
        plain
        value={value}
        onChange={onChange}
      />
      <Link href={`/search?${constructSearchString({ searchText: value })}`}>
        <Button margin="xsmall">
          <Search size="medium"/>
        </Button>
      </Link>
    </Box>
  );

};
