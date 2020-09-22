import { Box, Heading } from "grommet";
import React, { useCallback, useEffect } from "react";
import { LocalizedString } from "simstate-i18n";
import { lang } from "src/i18n";
import { AdminGetUsersSchema } from "yaarxiv-api/admin/getUsers";
import { requireAuth } from "src/utils/requireAuth";
import { getApi } from "src/apis";
import { adminApis } from "src/apis/admin";
import { useAsync } from "react-async";
import { useRouter } from "next/router";
import { queryToIntOrDefault, queryToString } from "src/utils/querystring";
import { SearchBar } from "src/components/SearchBar";
import { removeNullOrUndefinedKey } from "src/utils/array";
import { useHttpErrorHandler } from "src/utils/useHttpErrorHandler";
import { AdminUsersTable } from "src/pageComponents/admin/users/AdminUsersTable";

const root = lang.pages.admin.users;

const api = getApi(adminApis);

type SearchQuery =Partial<AdminGetUsersSchema["querystring"]>;

const getUsers = ([query]: [SearchQuery]) => api.getUsers({ query });
const deleteUser = async (userId: string) => {
  await api.deleteUser({ path: { userId } });
};



export const AdminUsersPage: React.FC = requireAuth({ roles: ["admin"]})(() => {

  const router = useRouter();

  const page = queryToIntOrDefault(router.query.page, undefined);
  const errorHandler = useHttpErrorHandler();
  const searchWord = queryToString(router.query.searchWord);

  const { data, isLoading, run } = useAsync({
    deferFn: getUsers,
    onReject: errorHandler,
  });

  const updateQuery = useCallback((newQuery: SearchQuery) => {
    const combinedQuery = removeNullOrUndefinedKey({
      searchWord,
      ...newQuery,
      ...page ? { page } : undefined,
    });
    router.push({
      pathname: "/admin/users",
      query: combinedQuery,
    });
  }, [searchWord]);

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
      <AdminUsersTable
        users={data?.users ?? []}
        totalCount={data?.totalCount ?? 0}
        getPageUrl={(i) => ({
          pathname: "/admin/users",
          query: { searchWord, page: i },
        })}
        isLoading={isLoading}
        reload={searchWithArgs}
        page={page ?? 1}
        deleteUser={deleteUser}
      />
    </Box>
  );
});

export default AdminUsersPage;
