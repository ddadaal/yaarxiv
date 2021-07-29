import React, { useState } from "react";
import { FormField, Box, Text, Button } from "grommet";
import { Localized, prefix } from "src/i18n";
import { useHttpRequest } from "src/utils/http";
import { HttpError } from "src/apis/fetch";
import { toast } from "react-toastify";
import { Form } from "src/components/form/Form";
import { api } from "src/apis";

const root = prefix("pages.dashboard.changePassword.");

const initial = {
  current: "",
  changed: "",
  confirmChanged: "",
};

export const ChangePasswordForm: React.FC = () => {

  const [form, setForm] = useState(initial);

  const error =
    form.changed && form.confirmChanged
    && form.changed !== form.confirmChanged
      ? <Localized id={root("changedNotMatch")} />
      : undefined;

  const [loading, setLoading] = useState(false);
  const request = useHttpRequest(setLoading);

  const submit = () => request(async () => {
    if (error) { return; }
    await api.dashboard.changePassword({
      body: {
        current: form.current,
        changed: form.changed,
      },
    })
      .then(() => {
        toast.success(
          <Localized id={root("complete")} />,
        );
        setForm(initial);
      })
      .catch((e: HttpError) => {
        if (e.status === 403) {
          toast.error(
            <Localized id={root("wrongPassword")} />,
          );
        } else {
          throw e;
        }
      });
  });

  return (
    <Form
      value={form}
      onChange={setForm}
      onReset={() => setForm(initial)}
      onSubmit={submit}
    >
      <FormField
        name="current"
        label={<Localized id={root("current")} />}
        type="password"
        required
      />
      <FormField
        name="changed"
        label={<Localized id={root("changed")} />}
        type="password"
        required
      />
      <FormField
        name="confirmChanged"
        label={<Localized id={root("confirmChanged")} />}
        type="password"
        required
      />
      {error && (
        <Box pad={{ horizontal: "small" }}>
          <Text color="status-error">{error}</Text>
        </Box>
      )}
      <Box direction="row" gap="medium" margin={{ top: "medium" }}>
        <Button
          type="submit"
          label={
            <Localized
              id={loading ? root("confirming") : root("confirm")}
            />
          }
          primary={true}
          disabled={loading}
        />
        <Button
          type="reset"
          label={<Localized id={root("reset")} />}
          disabled={loading}
        />
      </Box>
    </Form>
  );
};
