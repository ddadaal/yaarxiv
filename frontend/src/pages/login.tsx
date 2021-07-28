import React, { useState } from "react";
import {
  Box, FormField,
  TextInput, Button, CheckBox, Heading,
} from "grommet";
import { Localized, prefix } from "src/i18n";
import { api } from "src/apis";
import { useStore } from "simstate";
import { UserStore } from "src/stores/UserStore";
import { useRouter } from "next/router";
import { emailValidation } from "src/utils/validations/emailValidation";
import { useHttpRequest } from "src/utils/http";
import { AnchorLink } from "src/components/AnchorLink";
import { toast } from "react-toastify";
import { Form } from "src/components/form/Form";
import { queryToString } from "src/utils/querystring";
import { LoginSchema, UserRole } from "yaarxiv-api/api/auth/login";
import { HttpError } from "src/apis/fetch";

const root = prefix("login.");

const defaultValue = { id: "", password: "", remember: true };

const LoginForm: React.FC = () => {
  const router = useRouter();

  const pathname = queryToString(router.query.pathname);
  const asPath = queryToString(router.query.asPath);

  const userStore = useStore(UserStore);
  const [value, setValue] = useState(defaultValue);
  const [inProgress, setInProgress] = useState(false);
  const request = useHttpRequest(setInProgress);

  const jumpBackOrDefault = async (defaultPath: string) => {
    if (pathname) {
      await router.push(pathname, asPath);
    } else {
      await router.push(defaultPath);
    }
  };

  const login = () => request(async () => {
    const { id, password, remember } = value;
    try {
      const res = await api.auth.login({ query: { id, password } });
      toast.success(
        <Localized id={root("success")} />
      );

      userStore.login({
        email: id,
        name: res.name,
        token: res.token,
        remember: remember,
        role: res.role,
        id: res.userId,
      });
      if (res.role === UserRole.Admin){
        await jumpBackOrDefault("/admin/articles");
      } else {
        await jumpBackOrDefault("/");
      }
    } catch (e) {
      const ex = e as HttpError;
      if (ex.status === 401) {
        toast.error(
          <Localized id={root("error.invalid")} />
        );
      } else if (ex.status === 403) {
        if ((ex.data as LoginSchema["responses"]["403"]).emailSent) {
          toast.error(
            <Localized id={root("error.emailSent")} />
          );
        } else {
          toast.error(
            <Localized id={root("error.emailNotSent")} />
          );
        }
      } else {
        throw e;
      }
    }
  });

  return (
    <Form value={value} onChange={setValue} onSubmit={login} validate="blur">
      <FormField
        label={<Localized id={root("id")} />}
        name="id" required={true}
        disabled={inProgress}
        validate={emailValidation}
      >
        <TextInput name="id"/>
      </FormField>
      <FormField
        label={<Localized id={root("password")} />} name="password" required={true}
        disabled={inProgress}
      >
        <TextInput type="password" name="password"/>
      </FormField>
      <Box margin={{ vertical: "small" }}>
        <CheckBox
          name="remember" label={<Localized id={root("remember")} />}
        />
      </Box>
      <Box>
        <Button
          type="submit"
          label={<Localized id={inProgress ? root("inProgress") : root("login")} />}
          primary={true}
          disabled={inProgress}
        />
      </Box>
      <Box direction="row" justify="between" margin={{ top: "small" }}>
        <AnchorLink href={{ pathname: "/forget", query: { email: value.id } }}>
          <Localized id={root("forget")} />
        </AnchorLink>
        <AnchorLink href="/register">
          <Localized id={root("register")} />
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
          <Localized id={root("login")} />
        </Heading>
        <LoginForm />
      </Box>
    </Box>
  );
};

export default LoginPage;
