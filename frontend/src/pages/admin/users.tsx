import { Box, Heading } from "grommet";
import React, { useCallback, useEffect } from "react";
import { Localized } from "src/i18n";
import { prefix } from "src/i18n";
import { AdminGetUsersSchema } from "yaarxiv-api/api/admin/getUsers";
import { requireAuth } from "src/utils/requireAuth";

import { useAsync } from "react-async";
import { useRouter } from "next/router";
import { queryToIntOrDefault, queryToString } from "src/utils/querystring";
import { SearchBar } from "src/components/SearchBar";
import { removeNullOrUndefinedKey } from "src/utils/array";
import { useHttpErrorHandler } from "src/utils/http";
import { AdminUsersTable } from "src/pageComponents/admin/users/AdminUsersTable";
import { api } from "src/apis";
import { UserId } from "yaarxiv-api/api/auth/models";
import { UserRole } from "src/models/User";
import { I18nTitle } from "src/i18n/I18nTitle";

const root = prefix("pages.admin.users.");

type SearchQuery =Partial<AdminGetUsersSchema["querystring"]>;

const getUsers = ([query]: [SearchQuery]) => api.admin.adminGetUsers({ query });
const deleteUser = async (userId: UserId) => {
  await api.admin.adminDeleteUser({ path: { userId } });
};



export const AdminUsersPage: React.FC = requireAuth({ roles: [UserRole.Admin]})(() => {

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
  }, [router, page, searchWord]);

  const searchWithArgs = useCallback(() => {
    run({ page, searchWord });
  }, [page, searchWord]);

  useEffect(searchWithArgs, [searchWithArgs]);

  return (
    <Box gap="medium">
      <I18nTitle id={root("title")} />
      <Heading level={1} size="small" margin="none">
        <Localized id={root("title")} />
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
