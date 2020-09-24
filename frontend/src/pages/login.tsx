import React, { useState } from "react";
import {
  Box, Form, FormField,
  TextInput, Button, CheckBox, Heading,
} from "grommet";
import { lang } from "src/i18n";
import { LocalizedString } from "simstate-i18n";
import { getApi } from "src/apis";
import { authApis } from "src/apis/auth";
import { useStore } from "simstate";
import { UserStore } from "src/stores/UserStore";
import Router from "next/router";
import { emailValidation } from "src/utils/validations/emailValidation";
import { useHttpRequest } from "src/utils/useHttpErrorHandler";
import { AnchorLink } from "src/components/AnchorLink";
import { toast } from "react-toastify";

const root = lang.login;

const defaultValue = { id: "", password: "", remember: true };

const api = getApi(authApis);

const LoginForm: React.FC = () => {
  const userStore = useStore(UserStore);
  const [value, setValue] = useState(defaultValue);
  const [inProgress, setInProgress] = useState(false);
  const request = useHttpRequest(setInProgress);

  const login = () => request(async () => {
    const { id, password, remember } = value;
    try {
      const res = await api.login({ query: { id, password } });
      toast.success(
        <LocalizedString id={root.success} />
      );

      userStore.login({
        email: id,
        name: res.name,
        token: res.token,
        remember: remember,
        role: res.role,
        id: res.userId,
      });
      if (res.role === "admin"){
        await Router.push("/admin/articles");
      } else {
        await Router.push("/");
      }
    } catch (e) {
      console.log(e);
      if (e.status === 401) {
        toast.error(
          <LocalizedString id={root.invalid} />
        );
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
        <TextInput name="id"/>
      </FormField>
      <FormField
        label={<LocalizedString id={root.password} />} name="password" required={true}
        disabled={inProgress}
      >
        <TextInput type="password" name="password"/>
      </FormField>
      <Box margin={{ vertical: "small" }}>
        <CheckBox
          name="remember" label={<LocalizedString id={root.remember} />}
        />
      </Box>
      <Box>
        <Button
          type="submit"
          label={<LocalizedString id={inProgress ? root.inProgress : root.login} />}
          primary={true}
          disabled={inProgress}
        />
      </Box>
      <Box direction="row" justify="between" margin={{ top: "small" }}>
        <AnchorLink href={{ pathname: "/forget", query: { email: value.id } }}>
          <LocalizedString id={root.forget} />
        </AnchorLink>
        <AnchorLink href="/register">
          <LocalizedString id={root.register} />
        </AnchorLink>
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
