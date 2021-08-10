import React, { useState } from "react";
import { Box, Text, Heading } from "grommet";
import { AnchorLink } from "../../components/AnchorLink";
import { ArticleSearchResult } from "yaarxiv-api/api/article/search";
import { Author } from "yaarxiv-api/api/article/models";
import { ArticleMetadata } from "./ArticleMetadata";
import { ArticleAuthors } from "./ArticleAuthors";
import { HighlightedText, Mark } from "src/components/HighlightedText";
import { articleInfoMultiLangPartToLangMap } from "src/models/Article";
import { Localized, prefix, useI18n } from "src/i18n";


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

  const map = articleInfoMultiLangPartToLangMap(article);

  const i18n = useI18n();

  const localizedInfo: { title: string; keywords: string[]; } =
    map[i18n.currentLanguage.id]
      ?? (map.cn ? map.cn : map.en);

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
            <HighlightedText text={localizedInfo.title} highlights={[searchText]} />
          </AnchorLink>
        </Heading>
      </Box>
      <ArticleAuthors
        authors={authors}
        highlightNames={searchAuthors}
        onAuthorClicked={onAuthorClicked}
      />
      <AbstractBox
        searchText={searchText}
        abstract={abstract}
      />
      <Box direction="row" wrap>
        {localizedInfo.keywords.map((k) => (
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
        codeLink={codeLink}
        doi={doi}
      />
    </Box>
  );
};
