import React, { useState } from "react";
import { prefix } from "src/i18n";

import { FormField, Box, Button } from "grommet";
import { useAsync } from "react-async";
import { OverlayLoading } from "src/components/OverlayLoading";
import { Localized } from "src/i18n";
import { useHttpErrorHandler, useHttpRequest } from "src/utils/http";
import { emailValidation } from "src/utils/validations/emailValidation";
import { toast } from "react-toastify";
import { Form } from "src/components/form/Form";
import { api } from "src/apis";

const root = prefix("pages.dashboard.information.");

const getProfile = () => api.dashboard.dashboardGetProfile({});

const emptyForm = {
  email: "",
  name: "",
};

export const UserProfileForm: React.FC = () => {

  const [form, setForm] = useState(emptyForm);

  const [loading, setLoading] = useState(false);
  const request = useHttpRequest(setLoading);
  const errorHandler = useHttpErrorHandler();

  const { data, isPending } = useAsync({
    promiseFn: getProfile,
    onResolve: (profile) => setForm(profile),
    onReject: errorHandler,
  });

  const submit = () => request(async ({ userStore }) => {
    await api.dashboard.changeProfile({
      body: {
        email: form.email,
        name: form.name,
      },
    })
      .then(() => {
        toast.success(
          <Localized id={root("success")} />
        );
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
        <FormField
          disabled label={<Localized id={root("account.id")} />}
          value={data?.userId}
        />
        <FormField name="name" label={<Localized id={root("account.name")} />} />
        <FormField
          name="email" label={<Localized id={root("account.email")} />}
          validate={emailValidation}
        />
        <Box direction="row" gap="medium" margin={{ top: "medium" }}>
          <Button
            type="submit"
            label={
              <Localized
                id={loading ? root("confirming") : root("confirm")}
              />
            }
            primary
            disabled={loading}
          />
          <Button
            type="reset"
            label={<Localized id={root("reset")} />}
            disabled={loading}
          />
        </Box>
      </Form>
    </OverlayLoading>
  );
};
