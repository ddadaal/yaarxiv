import React, { useState, useCallback, useMemo, useEffect } from "react";
import { TextInput, Box, Button } from "grommet";
import { Search } from "grommet-icons";
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

  useEffect(() => {
    setValue(query?.searchText ?? "");
  }, [query?.searchText]);

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
