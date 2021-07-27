import { Box, ColumnConfig, DataTable } from "grommet";
import { Edit } from "grommet-icons";
import React, { useCallback, useMemo, useState } from "react";
import { Localized } from "src/i18n";
import { OverlayLoading } from "src/components/OverlayLoading";
import { prefix } from "src/i18n";
import { formatDateTime } from "src/utils/datetime";
import type { DashboardArticleInfo } from "yaarxiv-api/api/dashboard/getArticles";
import { AnchorLink } from "src/components/AnchorLink";
import { useHttpErrorHandler } from "src/utils/http";
import { Pagination } from "src/components/Pagination";
import { useAsync } from "react-async";
import { DeleteArticleLink } from "./DeleteArticleLink";
import { PublicityText } from "../../PublicityText";
import { PublicitySelect } from "../../PublicitySelect";
import { api } from "src/apis";

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

const getDashboardData = ([page]) =>
  api.dashboard.userGetArticleInfo({ query: { page } });

const getDashboardDataFirstPage = () => getDashboardData([1]);
const deleteArticle = (articleId: number) =>
  api.article.deleteArticle({ path: { articleId } });

const changeOwnerSetArticlePublicity = async (articleId: number, publicity: boolean) => {
  const resp = await api.dashboard.changeArticleOwnerSetPublicity({
    path: { articleId },
    body: { publicity },
  });

  return resp.publicity;
};

export const ArticleTable: React.FC = ({}) => {

  const [page, setPage] = useState(1);

  const errorHandler = useHttpErrorHandler();

  const { data, isPending, run, error } = useAsync({
    promiseFn: getDashboardDataFirstPage,
    deferFn: getDashboardData,
    onReject: errorHandler,
  });

  const onPageClicked = useCallback((page: number) => {
    setPage(page);
    run(page);
  }, [setPage, run]);

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
        <Box direction="row" gap="medium">
          <AnchorLink
            icon={<Edit />}
            label={<Localized id={root("update")} />}
            href="/articles/[id]/update" as={`/articles/${d.id}/update`}
          />
          <DeleteArticleLink
            articleId={d.id}
            deleteArticle={deleteArticle}
            reload={() => run(page)}
          />
        </Box>
      ),
    },
  ], [page, run, deleteArticle]);

  const handler = useHttpErrorHandler();

  if (error) {
    handler(error);
  }

  return (
    <OverlayLoading loading={isPending}>
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
          onPageClicked={onPageClicked}
        />
      </Box>
    </OverlayLoading>
  );
};
