import { Box, Heading } from "grommet";
import React, { useCallback, useEffect } from "react";
import { Localized, prefix } from "src/i18n";
import { AdminGetArticlesSchema } from "yaarxiv-api/api/admin/getArticles";
import { requireAuth } from "src/utils/requireAuth";
import { useAsync } from "react-async";
import { useRouter } from "next/router";
import { queryToIntOrDefault, queryToString } from "src/utils/querystring";
import { SearchBar } from "src/components/SearchBar";
import { removeNullOrUndefinedKey } from "src/utils/array";
import { useHttpErrorHandler } from "src/utils/useHttpErrorHandler";
import { AdminArticleTable } from "src/pageComponents/admin/articles/AdminArticlesTable";
import { api } from "src/apis";
import { ArticleId } from "../../../../api/api/article/models";
import { UserRole } from "src/models/User";

const root = prefix("pages.admin.articles.");

type SearchQuery =Partial<AdminGetArticlesSchema["querystring"]>;

const getArticles = ([query]: [SearchQuery]) =>
  api.admin.adminGetArticles({ query });
const deleteArticle = async (articleId: ArticleId) => {
  await api.article.deleteArticle({ path: { articleId } });
};
const changeArticleAdminSetPublicity =
 async (articleId: ArticleId, publicity: boolean) => {
   return await api.admin.changeArticleAdminSetPublicity({
     path: { articleId },
     body: { publicity },
   }).then((x) => x.publicity);
 };

export const AdminArticlesPage: React.FC = requireAuth({ roles: [UserRole.Admin]})(() => {

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
        <Localized id={root("title")} />
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
        changeArticleAdminSetPublicity={changeArticleAdminSetPublicity}
      />
    </Box>
  );
});

export default AdminArticlesPage;
