import { Box, ColumnConfig, DataTable, Heading } from "grommet";
import React, { useCallback, useEffect } from "react";
import { LocalizedString } from "simstate-i18n";
import { OverlayLoading } from "src/components/OverlayLoading";
import { lang } from "src/i18n";
import { formatDateTime } from "src/utils/datetime";
import { AnchorLink } from "src/components/AnchorLink";
import {
  AdminGetArticlesResult,
  AdminGetArticlesSchema,
} from "yaarxiv-api/admin/getArticles";
import { requireAuth } from "src/utils/requireAuth";
import { getApi } from "src/apis";
import { adminApis } from "src/apis/admin";
import { useAsync } from "react-async";
import { useRouter } from "next/router";
import { queryToIntOrDefault, queryToString } from "src/utils/querystring";
import { SearchBar } from "src/components/SearchBar";
import { Pagination } from "src/components/Pagination";
import { removeNullOrUndefinedKey } from "src/utils/array";
import { useHttpErrorHandler } from "src/utils/useHttpErrorHandler";

const root = lang.pages.admin.articles;

const api = getApi(adminApis);

type SearchQuery =Partial<AdminGetArticlesSchema["querystring"]>;

const getArticles = ([query]: [SearchQuery]) => api.getArticles({ query });

export const columns: ColumnConfig<AdminGetArticlesResult>[] = [
  {
    property: "id",
    header: <LocalizedString id={root.articleId} />,
    render: (d) => (
      <AnchorLink
        href="/articles/[id]"
        as={`/articles/${d.id}`}
      >
        {d.id}
      </AnchorLink>
    ),
    primary: true,
  },
  {
    property: "title",
    header: <LocalizedString id={root.articleTitle} />,
  },
  {
    property: "createTime",
    header: <LocalizedString id={root.createTime} />,
    render: (d) => formatDateTime(d.createTime),
  },
  {
    property: "lastUpdatedTime",
    header: <LocalizedString id={root.lastUpdatedTime} />,
    render: (d) => formatDateTime(d.lastUpdatedTime),
  },
  {
    property: "revisionCount",
    header: <LocalizedString id={root.revisionCount} />,
  },
];

export const AdminArticlesPage: React.FC = requireAuth({ roles: ["admin"]})(() => {

  const router = useRouter();

  const page = queryToIntOrDefault(router.query.page, undefined);
  const errorHandler = useHttpErrorHandler();
  const searchWord = queryToString(router.query.searchWord);

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
  }, [searchWord]);

  useEffect(() => {
    run({ page, searchWord });
  }, [page, searchWord]);

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
      <OverlayLoading loading={isLoading}>
        <Box>
          <DataTable
            columns={columns}
            data={data?.articles ?? []}
          />
        </Box>
        <Box align="center">
          <Pagination
            currentPage={page ?? 1}
            itemsPerPage={10}
            totalItemsCount={data?.totalCount ?? 0}
            getUrl={(i) => ({
              pathname: "/admin/articles",
              query: { searchWord, page: i },
            })}
          />
        </Box>
      </OverlayLoading>
    </Box>
  );
});

export default AdminArticlesPage;
