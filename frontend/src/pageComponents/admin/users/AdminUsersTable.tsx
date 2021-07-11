import { ColumnConfig, Box, DataTable } from "grommet";
import React, { useMemo } from "react";
import { Localized, prefix } from "src/i18n";
import { OverlayLoading } from "src/components/OverlayLoading";
import { Pagination } from "src/components/Pagination";
import { UrlObject } from "url";
import { AdminGetUsersResult } from "yaarxiv-api/api/admin/getUsers";
import { UserId } from "../../../../../api/api/auth/models";
import { DeleteUserLink } from "./DeleteUserLink";

const root = prefix("pages.admin.users.");

export const columns: ColumnConfig<AdminGetUsersResult>[] = [
  {
    property: "id",
    header: <Localized id={root("userId")} />,
    primary: true,
  },
  {
    property: "name",
    header: <Localized id={root("name")} />,
  },
  {
    property: "email",
    header: <Localized id={root("email")} />,
  },
  {
    property: "role",
    header: <Localized id={root("role.title")} />,
    render: (d) => <Localized id={root("role."+d.role as any)} />,
  },
  {
    property: "articleCount",
    header: <Localized id={root("articleCount")} />,
  },
];

interface Props {
  users: AdminGetUsersResult[];
  isLoading: boolean;
  reload: (page: number) => void;
  deleteUser: (userId: UserId) => Promise<any>;
  page: number;
  totalCount: number;
  getPageUrl: (page: number) => string | UrlObject;
}

export const AdminUsersTable: React.FC<Props> = ({
  users,
  isLoading,
  reload,
  deleteUser,
  page,
  totalCount,
  getPageUrl,
}) => {
  const fullColumns = useMemo(() => [
    ...columns,
    {
      property: "actions",
      header: <Localized id={root("actions")} />,
      render: (d) => (
        <Box direction="row" gap="medium">
          <DeleteUserLink
            userId={d.id}
            username={d.name}
            deleteUser={deleteUser}
            reload={() => reload(page)}
          />
        </Box>
      ),
    },
  ], [page, reload, deleteUser]);

  return (
    <OverlayLoading loading={isLoading}>
      <Box>
        <DataTable
          columns={fullColumns}
          data={users}
        />
      </Box>
      <Box align="center">
        <Pagination
          currentPage={page}
          itemsPerPage={10}
          totalItemsCount={totalCount}
          getUrl={getPageUrl}
        />
      </Box>
    </OverlayLoading>
  );
};
