import React from "react";
import { Box, Text, Heading } from "grommet";
import { AnchorLink } from "../../components/AnchorLink";
import { ArticleSearchResult } from "yaarxiv-api/article/search";
import { Author } from "yaarxiv-api/article/models";
import { ArticleMetadata } from "./ArticleMetadata";
import { ArticleAuthors } from "./ArticleAuthors";
import { HighlightedText, Mark } from "src/components/HighlightedText";


interface Props {
  searchText: string;
  searchKeywords: string[];
  searchAuthors: string[];
  article: ArticleSearchResult;
  onAuthorClicked: (author: Author) => void;
  onKeywordClicked: (keywords: string) => void;
}

const Keyword: React.FC<{
  name: string;
  onKeywordClicked: Props["onKeywordClicked"];
  highlight: boolean;
}> = ({
  name,
  onKeywordClicked,
  highlight,
}) => (
  <Box
    margin="xsmall"
    pad="xsmall"
    border={{ color: undefined, side: "all", size: "small" }}
    onClick={() => onKeywordClicked(name)}
  >
    {highlight ? <Mark>{name}</Mark> : name}
  </Box>
);


export const ArticleSearchItem: React.FC<Props> = ({
  searchText,
  searchKeywords,
  searchAuthors,
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
          <HighlightedText text={title} highlights={[searchText]} />
        </AnchorLink>
      </Heading>
      <ArticleAuthors
        authors={authors}
        highlightNames={searchAuthors}
        onAuthorClicked={onAuthorClicked}
      />
      <Box>
        <Text>
          <HighlightedText text={abstract} highlights={[searchText]} truncate />
        </Text>
      </Box>
      <Box direction="row" wrap>
        {keywords.map((k) => (
          <Keyword
            highlight={searchKeywords.some((x) => k.includes(x))}
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
