import { Button, FormField, TextInput, CheckBox } from "grommet";
import React, { useState } from "react";
import { Author } from "yaarxiv-api/api/article/models";
import { Modal } from "src/components/modals/Modal";
import { Localized, prefix } from "src/i18n";
import { Form } from "src/components/form/Form";

const root = prefix("pages.upload.info.authors.");

interface Props {
  open: boolean;
  onCancel: () => void;
  onSubmit: (author: Author) => void;
}

const defaultValue: Author = {
  name: "",
  affiliation: "",
  correspondingAuthor: false,
};

export const AuthorInfoModal: React.FC<Props> = ({
  open, onCancel, onSubmit,
}) => {

  const [form, setForm] = useState(defaultValue);

  const onClose = () => {
    onCancel();
    setForm(defaultValue);
  };

  const submit = () => {
    if (form.affiliation && form.name) {
      onSubmit(form);
      setForm(defaultValue);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={<Localized id={root("add")} />}
      footer={[
        <Button
          key="confirm"
          primary
          type="submit"
          label={<Localized id={root("confirm")} />}
          onClick={submit}
        />,
        <Button
          key="cancel"
          label={<Localized id={root("cancel")} />}
          onClick={onClose}
        />,
      ]}
    >
      <Form
        value={form} onChange={setForm} validate="blur"
      >
        <FormField
          label={<Localized id={root("name")} />}
          name="name" required={true}
        >
          <TextInput name="name"/>
        </FormField>
        <FormField
          label={<Localized id={root("affiliation")} />}
          name="affiliation" required={true}
        >
          <TextInput name="affiliation"/>
        </FormField>
        <CheckBox
          name="correspondingAuthor"
          label={<Localized id={root("correspondingAuthor")} />}
        />
      </Form>
    </Modal>
  );
};
