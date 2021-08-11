import { Box, Text } from "grommet";
import React from "react";
import { useI18n } from "src/i18n";
import { AnchorLink } from "src/components/AnchorLink";
import { Mark } from "src/components/HighlightedText";
import { Author } from "yaarxiv-api/api/article/models";

interface Props {
  authors: Author[];
  highlightNames?: string[];
  onAuthorClicked?: (author: Author) => void;
}

export const ArticleAuthors: React.FC<Props> = ({
  authors,
  highlightNames,
  onAuthorClicked,
}) => {

  const i18n = useI18n();

  return (
    <Box gap="medium" direction="row" wrap>
      {authors.map((author, i) => (
        <Text key={i} size="medium">
          <AnchorLink
            color="grey"
            onClick={() => onAuthorClicked?.(author)}
            title={
              author.correspondingAuthor ?
              i18n.translate("pages.upload.info.authors.correspondingAuthor") as string
                : undefined
            }
          >
            {
              (highlightNames && highlightNames.includes(author.name))
                ? <Mark>{author.name}</Mark>
                : author.name
            } ({author.affiliation}) {author.correspondingAuthor ? "*" : undefined}
          </AnchorLink>
        </Text>
      ))}
    </Box>
  );
};
