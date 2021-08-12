import { Box, Heading, Text } from "grommet";
import React, { useState } from "react";
import { HighlightedText, Mark } from "src/components/HighlightedText";
import { Localized, prefix } from "src/i18n";
import { useLocalizedArticleInfo } from "src/models/Article";
import { ArticleAltTitle } from "src/pageComponents/article/ArticleAltTitle";
import { Author } from "yaarxiv-api/api/article/models";
import { ArticleSearchResult } from "yaarxiv-api/api/article/search";
import { AnchorLink } from "../../components/AnchorLink";
import { ArticleAuthors } from "./ArticleAuthors";
import { ArticleMetadata } from "./ArticleMetadata";


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
    pad="xsmall"
    margin={{ right: "xsmall", bottom: "xsmall" }}
    border={{ color: undefined, side: "all", size: "small" }}
    onClick={() => onKeywordClicked(name)}
  >
    {highlight ? <Mark>{name}</Mark> : name}
  </Box>
);

const AbstractBox: React.FC<{
  abstract: string;
  searchText: string;
}> = ({ abstract, searchText }) => {

  const [expanded, setExpanded] = useState(false);
  return (
    <Box hoverIndicator onClick={() => setExpanded(!expanded)}>
      <Text>
        <HighlightedText text={abstract} highlights={[searchText]} truncate={!expanded} />
      </Text>
    </Box>
  );
};

const root = prefix("pages.search.item.");

export const ArticleSearchItem: React.FC<Props> = ({
  searchText,
  searchKeywords,
  searchAuthors,
  article,
  onAuthorClicked,
  onKeywordClicked,
}) => {
  const {
    authors,
    abstract, articleId, lastUpdateTime, createTime,
    codeLink, doi, retractTime,
  } = article;

  const { main, alt } = useLocalizedArticleInfo(article);

  return (
    <Box gap="small" >
      <Box direction="row" align="center">
        {
          retractTime ? (
            <Box margin={{ right: "small" }}>
              <Text color="status-critical" weight="bold" size="large">
                <Localized id={root("retracted")} />
              </Text>
            </Box>
          ): undefined
        }
        <Heading level={2} size="small" margin="0">
          <AnchorLink href={"/articles/[id]"} as={`/articles/${article.articleId}`}>
            <HighlightedText text={main.title} highlights={[searchText]} />
          </AnchorLink>
        </Heading>
      </Box>
      <ArticleAuthors
        authors={authors}
        highlightNames={searchAuthors}
        onAuthorClicked={onAuthorClicked}
      />
      <Box margin={{ vertical: "xsmall" }}>
        <AbstractBox
          searchText={searchText}
          abstract={abstract}
        />
      </Box>
      <Box direction="row" wrap>
        {main.keywords.map((k) => (
          <Keyword
            highlight={searchKeywords.some((x) => k.includes(x))}
            key={k} name={k} onKeywordClicked={onKeywordClicked}
          />
        ))}
      </Box>
      { alt ? <ArticleAltTitle altInfo={alt} /> : undefined }
      <ArticleMetadata
        articleId={articleId}
        lastUpdateTime={lastUpdateTime}
        createTime={createTime}
        codeLink={codeLink}
        doi={doi}
      />
    </Box>
  );
};
