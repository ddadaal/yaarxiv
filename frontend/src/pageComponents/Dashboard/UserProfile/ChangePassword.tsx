import React, { useState } from "react";
import { lang } from "src/i18n";
import { getApi } from "src/apis";
import { dashboardApis } from "src/apis/dashboard";
import { Form, FormField, Box, Text, Button } from "grommet";
import { LocalizedString } from "simstate-i18n";
import { useHttpRequest } from "src/utils/useHttpErrorHandler";
import { HttpError } from "src/apis/fetch";

const root = lang.pages.dashboard.profile.changePassword;

const api = getApi(dashboardApis);

const initial = {
  current: "",
  changed: "",
  confirmChanged: "",
};

export const ChangePassword: React.FC = () => {

  const [form, setForm] = useState(initial);

  const error =
    form.changed && form.confirmChanged
    && form.changed !== form.confirmChanged
      ? <LocalizedString id={root.changedNotMatch} />
      : undefined;

  const [loading, setLoading] = useState(false);
  const request = useHttpRequest(setLoading);

  const submit = () => request(async ({ notification }) => {
    if (error) { return; }
    await api.changePassword({
      body: {
        current: form.current,
        changed: form.changed,
      },
    })
      .then(() => {
        notification.addNotification({
          level: "success",
          message: <LocalizedString id={root.complete} />,
        });
        setForm(initial);
      })
      .catch((e: HttpError) => {
        if (e.status === 403) {
          notification.addNotification({
            level: "error",
            message: <LocalizedString id={root.wrongPassword} />,
          });
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
        label={<LocalizedString id={root.current} />}
        type="password"
        required
      />
      <FormField
        name="changed"
        label={<LocalizedString id={root.changed} />}
        type="password"
        required
      />
      <FormField
        name="confirmChanged"
        label={<LocalizedString id={root.confirmChanged} />}
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
            <LocalizedString
              id={loading ? root.confirming : root.confirm}
            />
          }
          primary={true}
          disabled={loading}
        />
        <Button
          type="reset"
          label={<LocalizedString id={root.reset} />}
          disabled={loading}
        />
      </Box>
    </Form>
  );
};
