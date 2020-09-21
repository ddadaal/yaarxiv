import { Button } from "grommet";
import { Trash } from "grommet-icons";
import React, { useState } from "react";
import { LocalizedString } from "simstate-i18n";
import { AnchorLink } from "src/components/AnchorLink";
import { Modal } from "src/components/modals/Modal";
import { lang } from "src/i18n";
import { useHttpRequest } from "src/utils/useHttpErrorHandler";

const root = lang.pages.dashboard.articles;

export const DeleteLink: React.FC<{
  articleId: string;
  deleteArticle: (articleId: string) => Promise<any>;
  reload: () => void;
}> = ({ articleId, deleteArticle, reload }) => {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const request = useHttpRequest(setConfirming);

  const onDelete = async () => {
    request(async () => {
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

