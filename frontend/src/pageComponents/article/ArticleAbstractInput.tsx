import { Box, CheckBox, Text, TextArea } from "grommet";
import React, { useState } from "react";
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
  value, onChange, disabled, maxLength,
}) => {

  const [preview, setPreview] = useState(false);

  return (
    <Box>
      <Box margin={{ vertical: "small" }} justify="between" direction="row">
        <Box>
          <Text><Localized id={root("supportLatex")} /></Text>
        </Box>
        <Box>
          <CheckBox
            label={
              <Localized id={root("preview")} />
            }
            onClick={() => setPreview(!preview)} checked={preview}
          />
        </Box>
      </Box>
      {
        preview ? (
          <Box pad="small">
            <LatexContent>{value}</LatexContent>
          </Box>
        ) : (
          <TextArea
            disabled={disabled}
            name="abstract"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            maxLength={maxLength}
            rows={15}
          />
        )
      }
      <Box justify="end" direction="row" margin={{ vertical: "small" }}>
        <Text>
          <Localized id={root("length")} args={[value.length, maxLength]} />
        </Text>
      </Box>
    </Box>
  );
};
