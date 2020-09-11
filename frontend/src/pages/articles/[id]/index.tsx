import React from "react";
import { queryToIntOrDefault, queryToString } from "src/utils/querystring";
import { NextPage } from "next";
import { Article } from "yaarxiv-api/article/models";
import { getApi } from "src/apis";
import { articleApis } from "src/apis/article";
import { ArticlePage as ArticlePageComp } from "src/pageComponents/article/ArticlePage";
import { HttpError } from "src/apis/fetch";
import { UnifiedErrorPage } from "src/components/errors/UnifiedErrorPage";

type Props = {
  article: Article;
} | {
  error: HttpError;
}

const api = getApi(articleApis);

export const ArticlePage: NextPage<Props> = (props) => {

  if ("error" in props) {
    return <UnifiedErrorPage error={props.error} />;
  }
  return <ArticlePageComp article={props.article} />;

};

ArticlePage.getInitialProps = async (context) => {
  const articleId = queryToString(context.query.id);
  const revision = queryToIntOrDefault(context.query.revision, undefined);

  const data = await api.get({ path: { articleId }, query: { revision } })
    .then((x) => ({ article: x.article }))
    .catch((e: HttpError) => ({ error: e }));

  return data;
};

export default ArticlePage;
