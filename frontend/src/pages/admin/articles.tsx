import { Box, Heading } from "grommet";
import React, { useCallback, useEffect } from "react";
import { LocalizedString } from "simstate-i18n";
import { lang } from "src/i18n";
import { AdminGetArticlesSchema } from "yaarxiv-api/admin/getArticles";
import { requireAuth } from "src/utils/requireAuth";
import { getApi } from "src/apis";
import { adminApis } from "src/apis/admin";
import { useAsync } from "react-async";
import { useRouter } from "next/router";
import { queryToIntOrDefault, queryToString } from "src/utils/querystring";
import { SearchBar } from "src/components/SearchBar";
import { removeNullOrUndefinedKey } from "src/utils/array";
import { useHttpErrorHandler } from "src/utils/useHttpErrorHandler";
import { AdminArticleTable } from "src/pageComponents/admin/articles/AdminArticlesTable";
import { articleApis } from "src/apis/article";

const root = lang.pages.admin.articles;

const api = getApi(adminApis);
const articlesApi = getApi(articleApis);

type SearchQuery =Partial<AdminGetArticlesSchema["querystring"]>;

const getArticles = ([query]: [SearchQuery]) => api.getArticles({ query });
const deleteArticle = async (articleId: string) => {
  await articlesApi.deleteArticle({ path: { articleId } });
};

export const AdminArticlesPage: React.FC = requireAuth({ roles: ["admin"]})(() => {

  const router = useRouter();

  const page = queryToIntOrDefault(router.query.page, undefined);
  const searchWord = queryToString(router.query.searchWord);

  const errorHandler = useHttpErrorHandler();

  const { data, isLoading, run } = useAsync({
    deferFn: getArticles,
    onReject: errorHandler,
  });

  const updateQuery = useCallback((newQuery: SearchQuery) => {
    const combinedQuery = removeNullOrUndefinedKey({
      searchWord,
      ...newQuery,
      ...page ? { page } : undefined,
    });
    router.push({
      pathname: "/admin/articles",
      query: combinedQuery,
    });
  }, [router, page, searchWord]);

  const searchWithArgs = useCallback(() => {
    run({ page, searchWord });
  }, [page, searchWord]);

  useEffect(searchWithArgs, [searchWithArgs]);

  return (
    <Box gap="medium">
      <Heading level={1} size="small" margin="none">
        <LocalizedString id={root.title} />
      </Heading>
      <Box align="center">
        <SearchBar
          initialText={searchWord}
          onConfirm={(k) => updateQuery({ searchWord: k })}
        />
      </Box>
      <AdminArticleTable
        articles={data?.articles ?? []}
        totalCount={data?.totalCount ?? 0}
        getPageUrl={(i) => ({
          pathname: "/admin/articles",
          query: { searchWord, page: i },
        })}
        isLoading={isLoading}
        reload={searchWithArgs}
        page={page ?? 1}
        deleteArticle={deleteArticle}
      />
    </Box>
  );
});

export default AdminArticlesPage;
