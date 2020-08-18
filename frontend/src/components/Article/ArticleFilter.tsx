import React, { useState, useCallback } from "react";
import { Box, Heading, Text, TextInput, MaskedInput } from "grommet";
import { Separator } from "../Separator";
import { start } from "repl";

interface Props {
  startYear?: number;
  endYear?: number;
  onYearChange: (changed: { start?: number; end?: number }) => void;
  onAuthorsChange: (authors: string[]) => void;
}

const Filter: React.FC<{ titleId: string }> = ({ titleId, children }) => {
  return (
    <Box gap="small" elevation="small" border="all" pad="small">
      <Heading level={3} margin="none">{titleId}</Heading>
      <Box>
        {children}
      </Box>
    </Box>
  );
};

export const ArticleFilter: React.FC<Props> = (props) => {

  const [startYear, setStartYear] = useState(0);
  const [endYear, setEndYear] = useState(0);

  const onStartYearChange = useCallback((e) => {
    setStartYear(e.target.value);
  }, [setStartYear]);

  const onEndYearChange = useCallback((e) => {
    setEndYear(e.target.value);
  }, [setStartYear]);

  return (
    <Box gap="medium" >
      <Filter titleId="Year">
        <Box direction="row" justify="between" align="center" gap="medium">
          <TextInput
            type="number"
            value={startYear}
            onChange={onStartYearChange}
          />
          <Text>To</Text>
          <TextInput
            type="number"
            value={endYear}
            onChange={onEndYearChange}
          />
        </Box>
      </Filter>
      <Filter titleId="Authors">Authors</Filter>
    </Box>
  );

};
