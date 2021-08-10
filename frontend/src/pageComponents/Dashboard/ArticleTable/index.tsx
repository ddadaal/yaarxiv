import { Box, ColumnConfig, DataTable } from "grommet";
import React, { useMemo } from "react";
import { Localized } from "src/i18n";
import { prefix } from "src/i18n";
import { formatDateTime } from "src/utils/datetime";
import type {
  DashboardArticleInfo,
  UserGetArticleInfoSchema,
} from "yaarxiv-api/api/dashboard/getArticles";
import { AnchorLink } from "src/components/AnchorLink";
import { Pagination } from "src/components/Pagination";
import { RetractArticleLink } from "./RetractArticleLink";
import { PublicityText } from "../../PublicityText";
import { PublicitySelect } from "../../PublicitySelect";
import { api } from "src/apis";
import { UrlObject } from "url";
import { ArticleTitleOfLang } from "src/components/ArticleTitleOfLang";

const root = prefix("pages.dashboard.articles.");

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
];

const deleteArticle = (articleId: number) =>
  api.article.deleteArticle({ path: { articleId } });

const changeOwnerSetArticlePublicity = async (articleId: number, publicity: boolean) => {
  const resp = await api.dashboard.changeArticleOwnerSetPublicity({
    path: { articleId },
    body: { publicity },
  });

  return resp.publicity;
};

interface Props {
  page: number;
  data: UserGetArticleInfoSchema["responses"]["200"];
  getUrlOfPage: (page: number) => string | UrlObject;
  reload: () => void;
}

export const ArticleTable: React.FC<Props> = ({ page, data, getUrlOfPage, reload }) => {

  const fullColumns = useMemo(() => [
    ...columns,
    {
      property: "ownerSetPublicity",
      header: <Localized id={root("ownerSetPublicity")} />,
      render: (d) => (
        <PublicitySelect
          initialValue={d.ownerSetPublicity}
          onChange={(changed) => changeOwnerSetArticlePublicity(d.id, changed)}
        />
      ),
    },
    {
      property: "adminSetPublicity",
      header: <Localized id={root("adminSetPublicity")} />,
      render: (d) => (
        <PublicityText publicity={d.adminSetPublicity} />
      ),
    },
    {
      property: "actions",
      header: <Localized id={root("actions")} />,
      render: (d) => (
        <Box direction="row" gap="small">
          <AnchorLink
            label={<Localized id={root("update")} />}
            href="/articles/[id]/update" as={`/articles/${d.id}/update`}
          />
          <RetractArticleLink
            articleId={d.id}
            retractArticle={deleteArticle}
            reload={reload}
          />
        </Box>
      ),
    },
  ], [page, reload, deleteArticle]);

  return (
    <Box>
      <Box>
        <DataTable
          columns={fullColumns}
          data={data?.articles ?? []}
          // IE11 need this
          width="100%"
        />
      </Box>
      <Box align="center">
        <Pagination
          currentPage={page}
          itemsPerPage={10}
          totalItemsCount={data?.totalCount ?? 0}
          getUrl={getUrlOfPage}
        />
      </Box>
    </Box>
  );
};
