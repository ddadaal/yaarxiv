import { Box, Text } from "grommet";
import React from "react";
import { AnchorLink } from "src/components/AnchorLink";
import { Mark } from "src/components/HighlightedText";
import { Author } from "yaarxiv-api/article/models";

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
  return (
    <Box gap="small" direction="row" wrap>
      {authors.map((author, i) => (
        <Text key={i} size="medium">
          <AnchorLink color="grey" onClick={() => onAuthorClicked?.(author)}>
            {
              (highlightNames && highlightNames.includes(author.name))
                ? <Mark>{author.name}</Mark>
                : author.name
            }
          </AnchorLink>
        </Text>
      ))}
    </Box>
  );
};
