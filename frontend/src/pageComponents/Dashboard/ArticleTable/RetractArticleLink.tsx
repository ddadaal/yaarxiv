import { Box, Button, Paragraph } from "grommet";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Localized, prefix } from "src/i18n";
import { AnchorLink } from "src/components/AnchorLink";
import { Modal } from "src/components/modals/Modal";
import { useHttpRequest } from "src/utils/http";
import { ArticleId } from "yaarxiv-api/api/article/models";

const root = prefix("pages.dashboard.articles.retract.");

interface Props {
  articleId: ArticleId;
  retractArticle: (articleId: ArticleId) => Promise<any>;
  reload: () => void;
}

export const RetractArticleLink: React.FC<Props> = ({
  articleId,
  retractArticle,
  reload,
}) => {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const request = useHttpRequest(setConfirming);

  const onOk = async () => {
    request(async () => {
      await retractArticle(articleId);
      setOpen(false);
      toast.success(
        <Localized id={root("success")} args={[articleId]} />
      );
      reload();
    });
  };

  return (
    <>
      <AnchorLink
        label={<Localized id={root("button")} />}
        onClick={() => setOpen(true)}
      />
      <Modal
        open={open}
        title={<Localized id={root("title")} />}
        content={(
          <>
            <Localized id={root("content1")} args={[articleId]}/>
            <br />
            <Localized id={root("content2")} />
          </>
        )}
        footer={[
          <Button
            key="confirm"
            primary
            disabled={confirming}
            label={<Localized id={root("confirm")} />}
            onClick={onOk}
          />,
          <Button
            key="cancel"
            disabled={confirming}
            label={<Localized id={root("cancel")} />}
            onClick={() => setOpen(false)}
          />,
        ]}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

