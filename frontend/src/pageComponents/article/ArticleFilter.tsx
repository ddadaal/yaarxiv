import React, { useState, useCallback, useEffect } from "react";
import { Box, Text, TextInput } from "grommet";
import { debounce } from "src/utils/debounce";
import { max, min } from "src/utils/math";
import { MultipleInput } from "../../components/Article/MultipleInput";
import { TitledSection } from "../../components/TitledSection";
import { lang } from "src/i18n";

const root = lang.pages.search;

interface Props {
  startYear?: number;
  endYear?: number;
  onYearChange: (changed: { startYear?: number; endYear?: number }) => void;
  authorNames?: string[];
  onAuthorsChange: (changed: { authorNames: string[]}) => void;
  keywords?: string[];
  onKeywordsChange: (changed: { keywords: string[] }) => void;
}

const YearRangeFilter: React.FC<Pick<Props,"endYear" | "startYear" | "onYearChange">> =
 (props) => {
   const [start, setStart] = useState(props.startYear ?? 0);
   const [end, setEnd] = useState(props.endYear ?? 0);

   const debouncedYearHandler = useCallback(
     debounce(props.onYearChange, 500),
     [props.onYearChange]);

   const update = (start: number, end: number) => {
     setStart(start);
     setEnd(end);
     debouncedYearHandler({ startYear: start, endYear: end });
   };

   const onStartYearChange = (e) => {
     const newStart = parseInt(e.target.value);
     if (Number.isNaN(newStart)) {return;}
     const newEnd = max(newStart, end);
     update(newStart, newEnd);
   };

   const onEndYearChange = (e) => {
     const newEnd = parseInt(e.target.value);
     if (Number.isNaN(newEnd)) {return;}
     const newStart = min(start, newEnd);
     update(newStart, newEnd);
   };

   useEffect(() => {
     setStart(props.startYear ?? 0);
     setEnd(props.endYear ?? 0);
   }, [props.startYear, props.endYear]);

   return (
     <Box direction="row" justify="between" align="center" gap="medium">
       <TextInput
         type="number"
         value={start}
         onChange={onStartYearChange}
         min={0}
       />
       <Text>To</Text>
       <TextInput
         type="number"
         value={end}
         onChange={onEndYearChange}
         min={0}
       />
     </Box>
   );
 };

export const ArticleFilter: React.FC<Props> = (props) => {

  return (
    <Box gap="medium" >
      <TitledSection titleId={root.year} border="all">
        <YearRangeFilter
          startYear={props.startYear}
          endYear={props.endYear}
          onYearChange={props.onYearChange}
        />
      </TitledSection>
      <TitledSection titleId={root.authors} border="all">
        <MultipleInput
          values={props.authorNames ?? []}
          onChange={(values) => props.onAuthorsChange({ authorNames: values })}
        />
      </TitledSection>
      <TitledSection titleId={root.keywords} border="all">
        <MultipleInput
          values={props.keywords ?? []}
          onChange={(values) => props.onKeywordsChange({ keywords: values })}
        />
      </TitledSection>
    </Box>
  );

};
