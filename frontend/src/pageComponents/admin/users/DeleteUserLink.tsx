import { Button } from "grommet";
import { Trash } from "grommet-icons";
import React, { useState } from "react";
import { LocalizedString } from "simstate-i18n";
import { AnchorLink } from "src/components/AnchorLink";
import { Modal } from "src/components/modals/Modal";
import { lang } from "src/i18n";
import { useHttpRequest } from "src/utils/useHttpErrorHandler";

const root = lang.pages.admin.users.delete;

export const DeleteUserLink: React.FC<{
  userId: string;
  username: string;
  deleteUser: (userId: string) => Promise<any>;
  reload: () => void;
}> = ({ userId, username, deleteUser, reload }) => {

  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const request = useHttpRequest(setConfirming);

  const onDelete = async () => {
    request(async () => {
      await deleteUser(userId);
      setOpen(false);
      reload();
    });
  };

  return (
    <>
      <AnchorLink
        icon={<Trash />}
        label={<LocalizedString id={root.button} />}
        onClick={() => setOpen(true)}
      />
      <Modal
        open={open}
        title={<LocalizedString id={root.title} />}
        content={<LocalizedString id={root.content} replacements={[username, userId]}/>}
        footer={[
          <Button
            key="confirm"
            primary
            disabled={confirming}
            label={<LocalizedString id={root.confirm} />}
            onClick={onDelete}
          />,
          <Button
            key="cancel"
            disabled={confirming}
            label={<LocalizedString id={root.cancel} />}
            onClick={() => setOpen(false)}
          />,
        ]}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

