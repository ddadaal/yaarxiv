import { Box, Button, ColumnConfig, DataTable } from "grommet";
import { Edit, Trash } from "grommet-icons";
import React, { useCallback, useMemo, useState } from "react";
import { LocalizedString } from "simstate-i18n";
import { OverlayLoading } from "src/components/OverlayLoading";
import { lang } from "src/i18n";
import { formatDateTime } from "src/utils/datetime";
import type { DashboardArticleInfo } from "yaarxiv-api/dashboard/getArticles";
import { AnchorLink } from "src/components/AnchorLink";
import { Modal } from "src/components/modals/Modal";
import { useHttpErrorHandler, useHttpRequest } from "src/utils/useHttpErrorHandler";
import { Pagination } from "src/components/Pagination";
import { useAsync } from "react-async";
import { getApi } from "src/apis";
import { articleApis } from "src/apis/article";
import { dashboardApis } from "src/apis/dashboard";

const root = lang.pages.dashboard.articles;

const DeleteLink: React.FC<{
  articleId: string;
  deleteArticle: (articleId: string) => Promise<any>;
  reload: () => void;
}> = ({ articleId, deleteArticle, reload }) => {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const handler = useHttpRequest(setConfirming);

  const onDelete = async () => {
    handler(async () => {
      await deleteArticle(articleId);
      setOpen(false);
      reload();
    });
  };

  return (
    <>
      <AnchorLink
        icon={<Trash />}
        label={<LocalizedString id={root.delete.button} />}
        onClick={() => setOpen(true)}
      />
      <Modal
        open={open}
        title={<LocalizedString id={root.delete.title} />}
        content={<LocalizedString id={root.delete.content} replacements={[articleId]}/>}
        footer={[
          <Button
            key="confirm"
            primary
            disabled={confirming}
            label={<LocalizedString id={root.delete.confirm} />}
            onClick={onDelete}
          />,
          <Button
            key="cancel"
            disabled={confirming}
            label={<LocalizedString id={root.delete.cancel} />}
            onClick={() => setOpen(false)}
          />,
        ]}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

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

const dashboardApi = getApi(dashboardApis);
const articleApi = getApi(articleApis);

const getDashboardData = ([page]) => dashboardApi.getArticles({ query: { page } });
const getDashboardDataFirstPage = () => getDashboardData([1]);
const deleteArticle = (articleId: string) =>
  articleApi.deleteArticle({ path: { articleId } });

export const ArticleTable: React.FC = ({}) => {

  const [page, setPage] = useState(0);

  const { data, isPending, run, error } = useAsync({
    promiseFn: getDashboardDataFirstPage,
    deferFn: getDashboardData,
  });

  const onPageClicked = useCallback((page: number) => {
    setPage(page);
    run(page);
  }, [setPage, run]);

  const fullColumns = useMemo(() => [
    ...columns,
    {
      property: "actions",
      header: <LocalizedString id={root.actions} />,
      render: (d) => (
        <Box direction="row" gap="medium">
          <AnchorLink
            icon={<Edit />}
            label={<LocalizedString id={root.update} />}
            href="/articles/[id]/update" as={`/articles/${d.id}/update`}
          />
          <DeleteLink
            articleId={d.id}
            deleteArticle={deleteArticle}
            reload={() => run(page)}
          />
        </Box>
      ),
    },
  ], [run, deleteArticle]);

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
