import { ColumnConfig, Box, DataTable } from "grommet";
import React, { useMemo } from "react";
import { LocalizedString } from "simstate-i18n";
import { OverlayLoading } from "src/components/OverlayLoading";
import { Pagination } from "src/components/Pagination";
import { lang } from "src/i18n";
import { UrlObject } from "url";
import { AdminGetUsersResult } from "yaarxiv-api/api/admin/getUsers";
import { UserId } from "../../../../../api/api/auth/models";
import { DeleteUserLink } from "./DeleteUserLink";

const root = lang.pages.admin.users;

export const columns: ColumnConfig<AdminGetUsersResult>[] = [
  {
    property: "id",
    header: <LocalizedString id={root.userId} />,
    primary: true,
  },
  {
    property: "name",
    header: <LocalizedString id={root.name} />,
  },
  {
    property: "email",
    header: <LocalizedString id={root.email} />,
  },
  {
    property: "role",
    header: <LocalizedString id={root.role.title} />,
    render: (d) => <LocalizedString id={root.role[d.role]} />,
  },
  {
    property: "articleCount",
    header: <LocalizedString id={root.articleCount} />,
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
      header: <LocalizedString id={root.actions} />,
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
