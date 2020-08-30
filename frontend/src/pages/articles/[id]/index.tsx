import React from "react";
import { queryToIntOrDefault, queryToString } from "src/utils/querystring";
import { GetServerSideProps } from "next";
import { Article } from "yaarxiv-api/article/models";
import { getApi } from "src/apis";
import { articleApis } from "src/apis/article";
import { ArticlePage as ArticlePageComp } from "src/pageComponents/article/ArticlePage";
import { HttpError } from "src/apis/fetch";
import { ServerError } from "src/components/errors/ServerError";
import { NotFound } from "src/components/errors/NotFound";

type Props = {
  article: Article;
} | {
  serverError: HttpError;
}

const api = getApi(articleApis);

export const ArticlePage: React.FC<Props> = (props) => {
  if ("article" in props) {
    return <ArticlePageComp article={props.article} />;
  } else {
    if (props.serverError.status === 404) {
      return <NotFound />;
    } else {
      return <ServerError error={props.serverError} />;
    }
  }

};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const articleId = queryToString(context.query.id);
  const revision = queryToIntOrDefault(context.query.revision, undefined);

  const data = await api.get({ path: { articleId }, query: { revision } })
    .then((x) => ({ article: x.article }))
    .catch((e: HttpError) => ({ serverError: e }));

  return { props: data };
};

export default ArticlePage;
