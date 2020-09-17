import React from "react";
import { Box, Text, Heading } from "grommet";
import { AnchorLink } from "../../components/AnchorLink";
import { ArticleSearchResult } from "yaarxiv-api/article/search";
import { Author } from "yaarxiv-api/article/models";
import { ArticleMetadata } from "./ArticleMetadata";


interface Props {
  article: ArticleSearchResult;
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


export const ArticleSearchItem: React.FC<Props> = ({
  article,
  onAuthorClicked,
  onKeywordClicked,
}) => {
  const {
    title,
    authors,
    keywords, abstract, articleId, lastUpdateTime, createTime,
  } = article;

  return (
    <Box gap="small" >
      <Heading level={2} size="small" margin="0">
        <AnchorLink href={"/articles/[id]"} as={`/articles/${article.articleId}`}>
          {title}
        </AnchorLink>
      </Heading>
      <Box gap="small" direction="row">
        {authors.map((author, i) => (
          <Text key={i} size="medium">
            <AnchorLink color="grey" onClick={() => onAuthorClicked(author)}>
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
      <ArticleMetadata
        articleId={articleId}
        lastUpdateTime={lastUpdateTime}
        createTime={createTime}
      />
    </Box>
  );
};
