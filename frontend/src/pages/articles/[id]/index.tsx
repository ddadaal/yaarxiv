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

interface Props {
  article: Article | null;
  serverError?: HttpError;
}

const api = getApi(articleApis);

export const ArticlePage: React.FC<Props> = ({ article, serverError }) => {
  if (article) {
    return <ArticlePageComp article={article} />;
  } else {
    if (serverError) {
      return <ServerError error={serverError} />;
    } else {
      return <NotFound />;
    }
  }

};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const articleId = queryToString(context.query.id);
  const revision = queryToIntOrDefault(context.query.revision, undefined);

  console.log(articleId, revision);

  try {
    const resp = await api.get({ path: { articleId }, query: { revision } });
    return { props: { article: resp.article } };
  } catch (e) {
    const ex = e as HttpError;
    if (ex.status === 404) {
      return { props: { article: null } };
    } else {
      return { props: { article: null, serverError: ex } };
    }
  }
};

export default ArticlePage;
