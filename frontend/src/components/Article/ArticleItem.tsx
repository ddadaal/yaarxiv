import React from "react";
import { Box, Text, Heading } from "grommet";
import type { ArticlePreview, Author } from "yaarxiv-api/article/search";
import { AnchorLink } from "../AnchorLink";
import { UrlObject } from "url";

interface Props {
  article: ArticlePreview;
  onAuthorClicked: (author: Author) => void;
  onKeywordClicked: (keywords: string) => void;
}

const Keyword: React.FC<{
  name: string;
  onKeywordClicked: Props["onKeywordClicked"]
}> = ({
  name,
  onKeywordClicked,
}) => (
  <Box
    margin="xsmall"
    pad="xsmall"
    border={{ color: undefined, side: "all", size: "small" }}
    onClick={() => onKeywordClicked(name)}
  >
    {name}
  </Box>
);

export const ArticleItem: React.FC<Props> = ({
  article,
  onAuthorClicked,
  onKeywordClicked,
}) => {
  const { title, authors,  keywords, abstract, id } = article;

  return (
    <Box gap="small" >
      <AnchorLink href={`/articles/${article.id}`}>
        <Heading level={2} size="small" margin="0">
          {title}
        </Heading>
      </AnchorLink>
      <Box gap="small" direction="row">
        {authors.map((author, i) => (
          <Text key={i} color="grey" size="medium">
            <AnchorLink onClick={() => onAuthorClicked(author)}>
              {author.name}
            </AnchorLink>
          </Text>
        ))}
      </Box>
      <Box>
        <Text truncate>{abstract}</Text>
      </Box>
      <Box direction="row" wrap>
        {keywords.map((k) => (
          <Keyword
            key={k} name={k} onKeywordClicked={onKeywordClicked}
          />
        ))}
      </Box>
      <Box direction="row">
        <Text>yaarxiv id: {id}</Text>
      </Box>
    </Box>
  );
};
