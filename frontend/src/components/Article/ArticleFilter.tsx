import React, { useState, useCallback, useEffect } from "react";
import { Box, Heading, Text, TextInput, MaskedInput } from "grommet";
import { debounce } from "src/utils/debounce";
import { max, min } from "src/utils/math";

interface Props {
  startYear?: number;
  endYear?: number;
  onYearChange: (changed: { startYear?: number; endYear?: number }) => void;
  onAuthorsChange: (changed: { authors: string[]}) => void;
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

const YearRangeFilter: React.FC<Pick<Props,"endYear" | "startYear" | "onYearChange">> =
 (props) => {
   const [start, setStart] = useState(props.startYear);
   const [end, setEnd] = useState(props.endYear);

   const debouncedYearHandler = useCallback(
     debounce(props.onYearChange, 500),
     [props.onYearChange]);

   const update = (start: number, end: number) => {
     setStart(start);
     setEnd(end);
     debouncedYearHandler({ startYear: start, endYear: end });
   };

   const onStartYearChange = (e) => {
     const newStart = e.target.value;
     const newEnd = max(newStart, end);
     update(newStart, newEnd);
   };

   const onEndYearChange = (e) => {
     const newEnd = e.target.value;
     const newStart = min(start, newEnd);
     update(newStart, newEnd);
   };

   useEffect(() => {
     setStart(props.startYear);
     setEnd(props.endYear);
   }, [props.startYear, props.endYear]);

   return (
     <Box direction="row" justify="between" align="center" gap="medium">
       <TextInput
         type="number"
         value={start}
         onChange={onStartYearChange}
       />
       <Text>To</Text>
       <TextInput
         type="number"
         value={end}
         onChange={onEndYearChange}
       />
     </Box>
   );
 };

export const ArticleFilter: React.FC<Props> = (props) => {

  return (
    <Box gap="medium" >
      <Filter titleId="Year">
        <YearRangeFilter
          startYear={props.startYear}
          endYear={props.endYear}
          onYearChange={props.onYearChange}
        />
      </Filter>
      <Filter titleId="Authors">Authors</Filter>
    </Box>
  );

};
