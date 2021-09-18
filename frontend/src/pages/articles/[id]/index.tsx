import React, {  } from "react";
import { queryToIntOrDefault } from "src/utils/querystring";
import { Article, ArticleId } from "yaarxiv-api/api/article/models";

import { ArticlePage as ArticlePageComp } from "src/pageComponents/article/ArticlePage";
import { HttpError } from "src/apis/fetch";
import { ParsedUrlQuery } from "querystring";
import { ssrPage } from "src/utils/ssr";
import { api } from "src/apis";
import { BadRequest } from "src/components/errors/BadRequest";

type Props =
| { status: "ok"; article: Article; }
| { status: "badArticleId"};


const getArticle = (articleId: ArticleId, revision: number | undefined) =>
  api.article
    .getArticle({ path: { articleId }, query: { revision } })
    .then((x) => x.article);

function getParams(query: ParsedUrlQuery) {
  const articleId = queryToIntOrDefault(query.id);
  const revision = queryToIntOrDefault(query.revision);

  return [articleId, revision] as const;
}

export const ArticlePage = ssrPage<Props>((props) => {
  if (props.status === "badArticleId") {
    return <BadRequest />;
  }

  return (
    <ArticlePageComp article={props.article} />
  );

}, async (context) => {

  const [articleId, revision] = getParams(context.query);

  if (articleId === undefined) {
    return { status: "badArticleId" };
  }

  const data = getArticle(articleId, revision)
    .then((article) => ({ status: "ok" as const, article }))
    .catch((e: HttpError) => ({ error: e }));

  return data;
});

export default ArticlePage;
