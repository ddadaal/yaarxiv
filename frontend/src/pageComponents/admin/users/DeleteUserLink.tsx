import { Button } from "grommet";
import { Trash } from "grommet-icons";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Localized, prefix } from "src/i18n";
import { AnchorLink } from "src/components/AnchorLink";
import { Modal } from "src/components/modals/Modal";
import { useHttpRequest } from "src/utils/http";
import { UserId } from "yaarxiv-api/api/auth/models";

const root = prefix("pages.admin.users.delete.");

export const DeleteUserLink: React.FC<{
  userId: UserId;
  username: string;
  deleteUser: (userId: UserId) => Promise<any>;
  reload: () => void;
}> = ({ userId, username, deleteUser, reload }) => {

  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const request = useHttpRequest(setConfirming);

  const onDelete = async () => {
    request(async () => {
      await deleteUser(userId);
      setOpen(false);
      toast.success(
        <Localized id={root("success")} args={[username, userId]} />
      );
      reload();
    });
  };

  return (
    <>
      <AnchorLink
        icon={<Trash />}
        label={<Localized id={root("button")} />}
        onClick={() => setOpen(true)}
      />
      <Modal
        open={open}
        title={<Localized id={root("title")} />}
        footer={[
          <Button
            key="confirm"
            primary
            disabled={confirming}
            label={<Localized id={root("confirm")} />}
            onClick={onDelete}
          />,
          <Button
            key="cancel"
            disabled={confirming}
            label={<Localized id={root("cancel")} />}
            onClick={() => setOpen(false)}
          />,
        ]}
        onClose={() => setOpen(false)}
      >
        <Localized id={root("content")} args={[username, userId]}/>
      </Modal>
    </>
  );
};

