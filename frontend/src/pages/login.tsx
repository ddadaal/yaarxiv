import React, { useState } from "react";
import {
  Box, Form, FormField,
  TextInput, Button, CheckBox, MaskedInput, Heading,
} from "grommet";
import { lang } from "src/i18n";
import { LocalizedString } from "simstate-i18n";
import Link from "next/link";
import { getApi } from "src/apis";
import { authApis } from "src/apis/auth";
import { useStore } from "simstate";
import { UserStore } from "src/stores/UserStore";
import Router from "next/router";
import { useNotification } from "src/utils/useNotification";
import { emailValidation } from "src/utils/validations/emailValidation";
import { emailMask } from "src/utils/validations/emailMask";
import { useHttpRequest } from "src/utils/useHttpErrorHandler";

const root = lang.login;

const defaultValue = { id: "", password: "", remember: true };

const api = getApi(authApis);

const LoginForm: React.FC = () => {
  const userStore = useStore(UserStore);
  const [value, setValue] = useState(defaultValue);
  const [inProgress, setInProgress] = useState(false);
  const notification = useNotification();
  const request = useHttpRequest(setInProgress);

  const login = () => request(async () => {
    const { id, password, remember } = value;
    try {
      const res = await api.login({ query: { id, password } });
      notification.addNotification({
        level: "success",
        message: <LocalizedString id={root.success} />,
      });
      if (res.role === "admin"){
        await Router.push("/admin/articles");
      } else {
        await Router.push("/");
      }
      userStore.login({
        userId: id,
        name: res.name,
        token: res.token,
        remember: remember,
        role: res.role,
      });
    } catch (e) {
      console.log(e);
      if (e.status === 401) {
        notification.addNotification({
          message: <LocalizedString id={root.invalid} />,
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
        label={<LocalizedString id={root.id} />}
        name="id" required={true}
        disabled={inProgress}
        validate={emailValidation}
      >
        <MaskedInput mask={emailMask} name="id"/>
      </FormField>
      <FormField
        label={<LocalizedString id={root.password} />} name="password" required={true}
        disabled={inProgress}
      >
        <TextInput type="password" name="password"/>
      </FormField>
      <FormField name="remember" disabled={inProgress}>
        <CheckBox name="remember" label={<LocalizedString id={root.remember} />}/>
      </FormField>
      <Box direction="row" justify="between" margin={{ top: "medium" }}>
        <Link href="/register">
          <Button label={<LocalizedString id={root.register} />}
            disabled={inProgress}
          />
        </Link>
        <Button
          type="submit"
          label={<LocalizedString id={inProgress ? root.inProgress : root.login} />}
          primary={true}
          disabled={inProgress}
        />
      </Box>
    </Form>
  );
};

export const LoginPage: React.FC = () => {
  return (
    <Box align="center" justify="center" pad="medium" flex="grow">
      <Box width="medium" border="all" pad="medium" elevation="small">
        <Heading alignSelf="center" level="2" margin="none">
          <LocalizedString id={root.login} />
        </Heading>
        <LoginForm />
      </Box>
    </Box>
  );
};

export default LoginPage;
