import React, { useState, useCallback, useMemo, useEffect } from "react";
import { TextInput, Box, Button } from "grommet";
import { Search } from "grommet-icons";
import Link from "next/link";
import { constructSearchString, SearchQuery } from "src/models/SearchQuery";

interface Props {
  initialText: string;
  onConfirm?: (keyword: string) => void;
}

export const SearchBar: React.FC<Props> = ({ initialText , onConfirm }) => {
  const [value, setValue] = useState(initialText);
  const onChange = useCallback((e) => {
    setValue(e.target.value);
  }, [setValue]);

  useEffect(() => {
    setValue(initialText);
  }, [initialText]);

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
      <Button margin="xsmall" onClick={() => onConfirm(value)}>
        <Search size="medium"/>
      </Button>
    </Box>
  );

};
