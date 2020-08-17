import React, { useState, useCallback } from "react";
import { TextInput, Box, Button } from "grommet";
import { Search } from "grommet-icons";
import { AnchorLink } from "./AnchorLink";
import Link from "next/link";

interface Props {
  onConfirm?: (str: string) => void;
}

export const SearchBar: React.FC<Props> = ({ onConfirm }) => {

  const [value, setValue] = useState("");
  const onChange = useCallback((e) => {
    setValue(e.target.value);
  }, [setValue]);

  return (
    <Box
      width="medium"
      direction="row"
      margin="large"
      align="center"
      round="small"
      border
    >
      <TextInput
        plain
        value={value}
        onChange={onChange}
      />
      <Link href={`/search/${value}`}>
        <Button margin="xsmall">
          <Search size="medium"/>
        </Button>
      </Link>
    </Box>
  );

};
