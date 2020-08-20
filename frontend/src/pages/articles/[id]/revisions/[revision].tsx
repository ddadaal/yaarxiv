import React from "react";
import { queryToString, queryToIntOrDefault } from "src/utils/querystring";
import { GetServerSideProps } from "next";
import { Article } from "yaarxiv-api/article/models";
import { getApi } from "src/apis";
import { articleApis } from "src/apis/article";
import { ArticlePage as ArticlePageComponent } from "src/components/Article/ArticlePage";

interface Props {
  article: Article;
}

const api = getApi(articleApis);

export const ArticlePage: React.FC<Props> = ({ article }) => {
  return <ArticlePageComponent article={article} />;

};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const articleId = queryToString(context.query.id);
  const revision = queryToIntOrDefault(context.query.revision, 0);

  const resp =await api.getWithIdAndRevision({ path: { articleId, revision } });

  return { props: { article: resp.article } };
};

export default ArticlePage;
