import { ColumnConfig, Box, DataTable } from "grommet";
import React, { useMemo } from "react";
import { Localized, prefix } from "src/i18n";
import { AnchorLink } from "src/components/AnchorLink";
import { OverlayLoading } from "src/components/OverlayLoading";
import { Pagination } from "src/components/Pagination";
import { PublicitySelect } from "src/pageComponents/PublicitySelect";
import { PublicityText } from "src/pageComponents/PublicityText";
import { formatDateTime } from "src/utils/datetime";
import { UrlObject } from "url";
import { AdminGetArticlesResult } from "yaarxiv-api/api/admin/getArticles";
import { DashboardArticleInfo } from "yaarxiv-api/api/dashboard/getArticles";
import { ArticleId } from "../../../../../api/api/article/models";
import { RetractArticleLink } from "../../Dashboard/ArticleTable/RetractArticleLink";
import { ArticleTitleOfLang } from "src/components/ArticleTitleOfLang";

const root = prefix("pages.admin.articles.");

export const columns: ColumnConfig<DashboardArticleInfo>[] = [
  {
    property: "id",
    header: <Localized id={root("articleId")} />,
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
    header: <Localized id={root("articleTitle")} />,
    render: (d) => <ArticleTitleOfLang info={d} />,
  },
  {
    property: "createTime",
    header: <Localized id={root("createTime")} />,
    render: (d) => formatDateTime(d.createTime),
  },
  {
    property: "lastUpdatedTime",
    header: <Localized id={root("lastUpdatedTime")} />,
    render: (d) => formatDateTime(d.lastUpdatedTime),
  },
  {
    property: "revisionCount",
    header: <Localized id={root("revisionCount")} />,
  },
  {
    property: "ownerSetPublicity",
    header: <Localized id={root("ownerSetPublicity")} />,
    render: (d) => (
      <PublicityText publicity={d.ownerSetPublicity} />
    ),
  },
];

interface Props {
  articles: AdminGetArticlesResult[];
  isLoading: boolean;
  reload: (page: number) => void;
  deleteArticle: (articleId: ArticleId) => Promise<any>;
  page: number;
  totalCount: number;
  getPageUrl: (page: number) => string | UrlObject;
  changeArticleAdminSetPublicity: (
    articleId: ArticleId,
    publicity: boolean,
  ) => Promise<boolean>;
}

export const AdminArticleTable: React.FC<Props> = ({
  articles,
  isLoading,
  reload,
  deleteArticle,
  page,
  totalCount,
  getPageUrl,
  changeArticleAdminSetPublicity,
}) => {
  const fullColumns = useMemo(() => [
    ...columns,
    {
      property: "adminSetPublicity",
      header: <Localized id={root("adminSetPublicity")} />,
      render: (d) => (
        <PublicitySelect
          initialValue={d.adminSetPublicity}
          onChange={(changed) => changeArticleAdminSetPublicity(d.id, changed)}
        />
      ),
    },
    {
      property: "actions",
      header: <Localized id={root("actions")} />,
      render: (d) => (
        <Box direction="row" gap="medium">
          <RetractArticleLink
            articleId={d.id}
            retractArticle={deleteArticle}
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
