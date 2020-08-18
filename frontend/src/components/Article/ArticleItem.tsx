import React from "react";
import { Box, Text, Heading } from "grommet";
import type { ArticlePreview } from "yaarxiv-api/article/search";
import { AnchorLink } from "../AnchorLink";

interface Props {
  article: ArticlePreview;
}

const Keyword: React.FC<{ name: string}> = ({ name }) => (
  <Box
    margin="xsmall"
    pad="xsmall"
    border={{ color: undefined, side: "all", size: "small" }}
  >{name}</Box>
);

export const ArticleItem: React.FC<Props> = ({ article }) => {

  const { title, authors, createTime, lastUpdateTime, keywords, abstract } = article;

  return (
    <Box gap="small" >
      <AnchorLink href={`/articles/${article.id}`}>
        <Text size="xxlarge" weight="bold" margin="0">
          {title}
        </Text>
      </AnchorLink>
      <Box gap="small" direction="row">
        {authors.map((author, i) => (
          <Text key={i} color="grey" size="medium">{author.name}</Text>
        ))}
      </Box>
      <Box>
        <Text>{abstract}</Text>
      </Box>
      <Box direction="row" wrap>
        {keywords.map((k) => <Keyword key={k} name={k}/>)}
      </Box>
    </Box>
  );
};
