import React, { useState } from "react";
import { lang } from "src/i18n";
import { getApi } from "src/apis";
import { dashboardApis } from "src/apis/dashboard";
import { Form, FormField, Box, Button } from "grommet";
import { useAsync } from "react-async";
import { OverlayLoading } from "src/components/OverlayLoading";
import { LocalizedString } from "simstate-i18n";
import { useHttpRequest } from "src/utils/useHttpErrorHandler";
import { emailValidation } from "src/utils/validations/emailValidation";

const root = lang.pages.dashboard.profile;

const api = getApi(dashboardApis);

const getProfile = () => api.getProfile({});

const emptyForm = {
  userId: "",
  email: "",
  name: "",
};

export const Profile: React.FC = () => {

  const [form, setForm] = useState(emptyForm);

  const [loading, setLoading] = useState(false);
  const request = useHttpRequest(setLoading);

  const { data, isPending } = useAsync({
    promiseFn: getProfile,
    onResolve: (profile) => setForm(profile),
  });

  const submit = () => request(async ({ notification, userStore }) => {
    await api.changeProfile({
      body: {
        email: form.email,
        name: form.name,
      },
    })
      .then(() => {
        notification.addNotification({
          level: "success",
          message: <LocalizedString id={root.success} />,
        });
        // change user store information
        userStore.login({
          ...userStore.user!,
          email: form.email,
          name: form.name,
        });
      });
  });

  return (
    <OverlayLoading loading={isPending}>
      <Form value={form}
        onSubmit={submit}
        onChange={setForm}
        validate="blur"
        onReset={() => setForm(data ?? emptyForm)}
      >
        <FormField name="userId" disabled label={<LocalizedString id={root.id} />} />
        <FormField name="name" label={<LocalizedString id={root.name} />} />
        <FormField
          name="email" label={<LocalizedString id={root.email} />}
          validate={emailValidation}
        />
        <Box direction="row" gap="medium" margin={{ top: "medium" }}>
          <Button
            type="submit"
            label={
              <LocalizedString
                id={loading ? root.confirming : root.confirm}
              />
            }
            primary
            disabled={loading}
          />
          <Button
            type="reset"
            label={<LocalizedString id={root.reset} />}
            disabled={loading}
          />
        </Box>
      </Form>
    </OverlayLoading>
  );
};
