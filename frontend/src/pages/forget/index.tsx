import React, { useState, useEffect } from "react";
import { Box, Heading, Form, FormField, TextInput, Button } from "grommet";
import { LocalizedString } from "simstate-i18n";
import { lang } from "src/i18n";
import { getApi } from "src/apis";
import { authApis } from "src/apis/auth";
import { useNotification } from "src/utils/useNotification";
import { useHttpRequest } from "src/utils/useHttpErrorHandler";
import Router, { useRouter } from "next/router";
import { emailValidation } from "src/utils/validations/emailValidation";
import { queryToString } from "src/utils/querystring";

const root = lang.forgetPassword;

const api = getApi(authApis);

const ForgetForm: React.FC<{ email: string }> = ({ email }) => {
  const [value, setValue] = useState({ email });
  const [inProgress, setInProgress] = useState(false);
  const notification = useNotification();
  const request = useHttpRequest(setInProgress);

  useEffect(() => {
    setValue({ email });
  }, [email]);

  const login = () => request(async () => {
    const { email } = value;
    try {
      await api.requestPasswordReset({ body: { email } });
      Router.push("/forget/sent");
    } catch (e) {
      if (e.status === 404) {
        notification.addNotification({
          message: <LocalizedString id={root.accountNotExist} />,
          level: "error",
        });
      } else {
        throw e;
      }
    }
  });

  return (
    <Form value={value} onChange={setValue} onSubmit={login} validate="blur">
      <FormField
        label={<LocalizedString id={root.email} />}
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
          label={<LocalizedString id={root.sendRecoveryMail} />}
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
      <Box width="medium" border="all" pad="medium" elevation="small">
        <Heading alignSelf="center" level="2" margin="none">
          <LocalizedString id={root.title} />
        </Heading>
        <ForgetForm email={email}  />
      </Box>
    </Box>
  );
};

export default ForgetPasswordPage;