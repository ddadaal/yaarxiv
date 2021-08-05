import { Button } from "grommet";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Localized, prefix } from "src/i18n";
import { AnchorLink } from "src/components/AnchorLink";
import { Modal } from "src/components/modals/Modal";
import { useHttpRequest } from "src/utils/http";
import { ArticleId } from "yaarxiv-api/api/article/models";

const root = prefix("pages.dashboard.articles.");

interface Props {
  articleId: ArticleId;
  deleteArticle: (articleId: ArticleId) => Promise<any>;
  reload: () => void;
}

export const DeleteArticleLink: React.FC<Props> = ({
  articleId,
  deleteArticle,
  reload,
}) => {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const request = useHttpRequest(setConfirming);

  const onDelete = async () => {
    request(async () => {
      await deleteArticle(articleId);
      setOpen(false);
      toast.success(
        <Localized id={root("delete.success")} args={[articleId]} />
      );
      reload();
    });
  };

  return (
    <>
      <AnchorLink
        label={<Localized id={root("delete.button")} />}
        onClick={() => setOpen(true)}
      />
      <Modal
        open={open}
        title={<Localized id={root("delete.title")} />}
        content={<Localized id={root("delete.content")} args={[articleId]}/>}
        footer={[
          <Button
            key="confirm"
            primary
            disabled={confirming}
            label={<Localized id={root("delete.confirm")} />}
            onClick={onDelete}
          />,
          <Button
            key="cancel"
            disabled={confirming}
            label={<Localized id={root("delete.cancel")} />}
            onClick={() => setOpen(false)}
          />,
        ]}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

