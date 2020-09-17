import { Box, Text } from "grommet";
import React from "react";
import { AnchorLink } from "src/components/AnchorLink";
import { Author } from "yaarxiv-api/article/models";

interface Props {
  authors: Author[];
  onAuthorClicked?: (author: Author) => void;
}

export const ArticleAuthors: React.FC<Props> = ({
  authors,
  onAuthorClicked,
}) => {
  return (
    <Box gap="small" direction="row" wrap>
      {authors.map((author, i) => (
        <Text key={i} size="medium">
          <AnchorLink color="grey" onClick={() => onAuthorClicked?.(author)}>
            {author.name}
          </AnchorLink>
        </Text>
      ))}
    </Box>
  );
};
