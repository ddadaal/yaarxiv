import React, { useState } from "react";
import { prefix } from "src/i18n";

import { FormField, Box, Button } from "grommet";
import { Localized } from "src/i18n";
import { useHttpRequest } from "src/utils/http";
import { emailValidation } from "src/utils/validations/emailValidation";
import { toast } from "react-toastify";
import { Form } from "src/components/form/Form";
import { api } from "src/apis";
import { GetAccountInfoSchema } from "yaarxiv-api/api/dashboard/getAccountInfo";

const root = prefix("pages.dashboard.accountInfo.");

interface Props {
  profile: GetAccountInfoSchema["responses"]["200"];
}

export const AccountInfoForm: React.FC<Props> = ({ profile }) => {

  const [form, setForm] = useState(profile);

  const [loading, setLoading] = useState(false);
  const request = useHttpRequest(setLoading);

  const submit = () => request(async ({ userStore }) => {
    await api.dashboard.changeAccountInfo({ body: { name: form.name } })
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
    <Form
      value={form}
      onSubmit={submit}
      onChange={setForm}
      validate="blur"
      onReset={() => setForm(profile)}
    >
      <FormField
        disabled label={<Localized id={root("id")} />}
        value={profile.userId}
      />
      <FormField
        name="email" label={<Localized id={root("email")} />}
        validate={emailValidation} disabled
      />
      <FormField name="name" label={<Localized id={root("name")} />} />
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
  );
};
