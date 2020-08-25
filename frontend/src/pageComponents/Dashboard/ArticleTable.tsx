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
import { useHttpErrorHandler } from "src/components/useHttpErrorHandler";

const root = lang.pages.dashboard.articles;

const DeleteLink = ({ articleId, deleteArticle, reload }) => {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const handler = useHttpErrorHandler(setConfirming);

  const onDelete = useCallback(async () => {
    handler(async () => {
      await deleteArticle(articleId);
      reload();
      setOpen(false);
    });
  }, [reload, deleteArticle]);

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

interface Props {
  data: DashboardArticleInfo[];
  loading: boolean;
  reload: () => void;
  deleteArticle: (articleId: string) => Promise<any>;
}

export const ArticleTable: React.FC<Props> = ({
  data,
  loading,
  reload,
  deleteArticle,
}) => {

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
            reload={reload}
          />
        </Box>
      ),
    },
  ], [reload, deleteArticle]);

  return (
    <OverlayLoading loading={loading}>
      <DataTable
        columns={fullColumns}
        data={data}
      />
    </OverlayLoading>
  );
};
