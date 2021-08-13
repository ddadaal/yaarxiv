import { NewAdminInfo } from "yaarxiv-api/api/setup/setup";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { api } from "src/apis";
import { HttpError } from "src/apis/fetch";
import { useHttpRequest } from "src/utils/http";
import { toast } from "react-toastify";
import { Form } from "src/components/form/Form";
import { Box, Button, FormField } from "grommet";
import { emailValidation } from "src/utils/validations/emailValidation";
import { Localized, prefix } from "src/i18n";

const root = prefix("pages.setup.");

const defaultForm: NewAdminInfo = {
  email: "",
  password: "",
};

export const SetupForm: React.FC = () => {
  const [form, setForm] = useState(defaultForm);

  const [loading, setLoading] = useState(false);
  const call = useHttpRequest(setLoading);
  const router = useRouter();

  const onSubmit = async () => {
    await call(() =>
      api.setup.setup({ body: { admin: form } })
        .then(() => {
          toast.success(<Localized id={root("success")} />);
          router.push("/");
        })
        .catch((e: HttpError) => {
          if (e.status === 409) {
            toast.error(<Localized id={root("conflict")}/>);
          } else { throw e; }
        }),
    );
  };

  return (
    <Form
      value={form}
      onSubmit={onSubmit}
      onChange={setForm}
      validate="blur"
    >
      <FormField
        name="email"
        label={<Localized id={root("email")} />}
        validate={emailValidation}
      />
      <FormField
        name="password"
        label={<Localized id={root("password")} />}
        type="password"
        required
      />
      <Box>
        <Button
          type="submit"
          label={<Localized id={root("submit")} />}
          primary={true}
          disabled={loading}
        />
      </Box>
    </Form>
  );
};
