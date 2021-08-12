import { Box, Text } from "grommet";
import React from "react";
import { languageProps, Localized } from "src/i18n";

interface Props {
  altInfo: { lang: "cn" | "en", title: string; keywords: string[] }
}

export const ArticleAltTitle: React.FC<Props> = ({
  altInfo,
}) => {

  const languageName = languageProps[altInfo.lang].name;

  return (
    <Box direction="row">
      <Text margin={{ right: "xsmall" }}>
        <Localized id="pages.search.altTitle.label" args={[languageName]} />
        :
      </Text>
      <Text weight="bold">
        {altInfo.title}
      </Text>
    </Box>
  );
};
