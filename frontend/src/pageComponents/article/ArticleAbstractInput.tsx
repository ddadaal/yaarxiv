import { Box, Tab, Tabs, Text, TextArea } from "grommet";
import React from "react";
import { LatexContent } from "src/components/Article/LatexContent";
import { Localized, prefix } from "src/i18n";

interface Props {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  maxLength: number;
}

const root = prefix("pages.upload.info.abstract.");

export const ArticleAbstractInput: React.FC<Props> = ({
  value, onChange, disabled, maxLength }) => {

  return (
    <Box>
      <Tabs>
        <Tab title={<Localized id={root("write")}/>}>
          <TextArea
            disabled={disabled}
            name="abstract"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            maxLength={maxLength}
            rows={15}
          />
        </Tab>
        <Tab title={<Localized id={root("preview")}/>}>
          <Box pad="small">
            <LatexContent>{value}</LatexContent>
          </Box>
        </Tab>
      </Tabs>
      <Box justify="between" direction="row" margin={{ vertical: "small" }}>
        <Box>
          <Text><Localized id={root("supportLatex")} /></Text>
        </Box>
        <Box>
          <Text>
            <Localized id={root("length")} args={[value.length, maxLength]} />
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
