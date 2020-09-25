import React, { useEffect, useMemo } from "react";
import { queryToIntOrDefault, queryToString } from "src/utils/querystring";
import { NextPage } from "next";
import { Article } from "yaarxiv-api/article/models";
import { getApi } from "src/apis";
import { articleApis } from "src/apis/article";
import { ArticlePage as ArticlePageComp } from "src/pageComponents/article/ArticlePage";
import { HttpError } from "src/apis/fetch";
import { UnifiedErrorPage } from "src/components/errors/UnifiedErrorPage";
import { useAsync } from "react-async";
import { useRouter } from "next/router";
import { useStore } from "simstate";
import { UserStore } from "src/stores/UserStore";
import { ParsedUrlQuery } from "querystring";
import { SSRPageProps } from "src/utils/ssr";
import { useFirstMount } from "src/utils/useFirstMount";
import { OverlayLoading } from "src/components/OverlayLoading";

type Props = SSRPageProps<{
  article: Article;
}>;

const api = getApi(articleApis);

const getArticle = ([articleId, revision]: [string, number | undefined]) =>
  api
    .get({ path: { articleId }, query: { revision } })
    .then((x) => x.article);

function getParams(query: ParsedUrlQuery) {
  const articleId = queryToString(query.id);
  const revision = queryToIntOrDefault(query.revision, undefined);

  return [ articleId, revision ] as const;
}

export const ArticlePage: NextPage<Props> = (props) => {

  if ("error" in props) {
    return <UnifiedErrorPage error={props.error} />;
  }

  const router = useRouter();

  const params = useMemo(() => getParams(router.query), [router.query]);

  const userStore = useStore(UserStore);

  // the best way to refresh the page when user state changes
  // is using the promiseFn and watch props by useAsync
  // but the promiseFn does not run when watch value changes.
  // So this is currently the only way .
  const { data, isLoading, error, run } = useAsync({
    deferFn: getArticle,
    initialValue: props.article,
  });

  const firstMount = useFirstMount();

  useEffect(() => {
    if (!firstMount) {
      run(...params);
    }
  }, [userStore.user, ...params]);


  if (error) {
    return <UnifiedErrorPage error={error as any as HttpError} />;
  }

  return (
    <OverlayLoading loading={isLoading}>
      { data ? <ArticlePageComp article={data}/> : undefined}
    </OverlayLoading>
  );

};

ArticlePage.getInitialProps = async (context) => {
  const [articleId, revision] = getParams(context.query);

  const data = getArticle([articleId, revision])
    .then((article) => ({ article }))
    .catch((e: HttpError) => ({ error: e }));

  return data;
};

export default ArticlePage;
