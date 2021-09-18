import React, { useState } from "react";
import { Box, Heading, FormField, TextInput, Button } from "grommet";
import { Localized, prefix } from "src/i18n";

import { useHttpRequest } from "src/utils/http";
import Router, { useRouter } from "next/router";
import { emailValidation } from "src/utils/validations/emailValidation";
import { queryToString } from "src/utils/querystring";
import { toast } from "react-toastify";
import { Form } from "src/components/form/Form";
import { api } from "src/apis";
import { I18nTitle } from "src/i18n/I18nTitle";

const root = prefix("forgetPassword.");

const ForgetForm: React.FC<{ email: string }> = ({ email }) => {
  const [value, setValue] = useState({ email });
  const [inProgress, setInProgress] = useState(false);
  const request = useHttpRequest(setInProgress);

  const login = () => request(async () => {
    const { email } = value;
    try {
      await api.auth.requestPasswordReset({ body: { email } });
      Router.push("/forget/sent");
    } catch (e) {
      if (e.status === 404) {
        toast.error(
          <Localized id={root("accountNotExist")} />
        );
      } else {
        throw e;
      }
    }
  });

  return (
    <Form value={value} onChange={setValue} onSubmit={login} validate="blur">
      <FormField
        label={<Localized id={root("email")} />}
        name="email" required={true}
        disabled={inProgress}
        validate={emailValidation}
        margin={{ vertical: "medium" }}
      >
        <TextInput name="email"/>
      </FormField>
      <Box>
        <Button
          type="submit"
          label={<Localized id={root("sendRecoveryMail")} />}
          primary={true}
          disabled={inProgress}
        />
      </Box>
    </Form>
  );
};
export const ForgetPasswordPage: React.FC = () => {

  const router = useRouter();

  const email = queryToString(router.query.email);

  return (
    <Box align="center" justify="center" pad="medium" flex="grow">
      <I18nTitle id={root("title")} />
      <Box width="medium" border="all" pad="medium" elevation="small">
        <Heading alignSelf="center" level="2" margin="none">
          <Localized id={root("title")} />
        </Heading>
        <ForgetForm email={email}  />
      </Box>
    </Box>
  );
};

export default ForgetPasswordPage;
