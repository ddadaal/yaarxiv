import { ColumnConfig, Box, DataTable } from "grommet";
import React, { useMemo } from "react";
import { LocalizedString } from "simstate-i18n";
import { AnchorLink } from "src/components/AnchorLink";
import { OverlayLoading } from "src/components/OverlayLoading";
import { Pagination } from "src/components/Pagination";
import { lang } from "src/i18n";
import { formatDateTime } from "src/utils/datetime";
import { UrlObject } from "url";
import { AdminGetArticlesResult } from "yaarxiv-api/admin/getArticles";
import { DashboardArticleInfo } from "yaarxiv-api/dashboard/getArticles";
import { DeleteArticleLink } from "../../Dashboard/DeleteArticleLink";

const root = lang.pages.admin.articles;

export const columns: ColumnConfig<DashboardArticleInfo>[] = [
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

interface Props {
  articles: AdminGetArticlesResult[];
  isLoading: boolean;
  reload: (page: number) => void;
  deleteArticle: (articleId: string) => Promise<any>;
  page: number;
  totalCount: number;
  getPageUrl: (page: number) => string | UrlObject;
}

export const AdminArticleTable: React.FC<Props> = ({
  articles,
  isLoading,
  reload,
  deleteArticle,
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
          <DeleteArticleLink
            articleId={d.id}
            deleteArticle={deleteArticle}
            reload={() => reload(page)}
          />
        </Box>
      ),
    },
  ], [page, reload, deleteArticle]);

  return (
    <OverlayLoading loading={isLoading}>
      <Box>
        <DataTable
          columns={fullColumns}
          data={articles}
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
