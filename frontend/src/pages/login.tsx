import React, { useState, useRef, useCallback } from "react";
import { Box, Form, FormField, TextInput, Button, CheckBox, MaskedInput } from "grommet";
import { lang } from "src/i18n";
import { LocalizedString } from "simstate-i18n";
import Link from "next/link";
import NotificationSystem, { System } from "react-notification-system";
import { getApi } from "src/apis";
import { authApis } from "src/apis/auth";
import { useStore } from "simstate";
import { UserStore } from "src/stores/UserStore";
import { useRouter } from "next/router";

const root = lang.login;

const defaultValue = { id: "", password: "", remember: true };

const emailMask = [
  {
    regexp: /^[\w\-_.]+$/,
    placeholder: "example",
  },
  { fixed: "@" },
  {
    regexp: /^[\w]+$/,
    placeholder: "my",
  },
  { fixed: "." },
  {
    regexp: /^[\w]+$/,
    placeholder: "com",
  },
];

const api = getApi(authApis);

const LoginForm: React.FC = () => {
  const userStore = useStore(UserStore);
  const [value, setValue] = useState(defaultValue);
  const notificationRef = useRef<System>();
  const router = useRouter();

  const login = async () => {
    const { id, password, remember } = value;
    const [resp, status] = await api.login({ id, password }, undefined);
    if (status === 200) {
      const res = resp as Extract<typeof resp, { token: string }>;
      userStore.login({
        userId: id,
        name: res.name,
        token: res.token,
        remember: remember,
      });
      router.push("/");
    } else {
      notificationRef.current.addNotification({
        message: "Your username and password is invalid",
        level: "error",
        position: "tc",
      });
    }
  };

  return (
    <>
      <Form value={value} onChange={setValue} onSubmit={login}>
        <FormField label={<LocalizedString id={root.id} />} name="id" required={true}>
          <MaskedInput mask={emailMask} name="id"/>
        </FormField>
        <FormField
          label={<LocalizedString id={root.password} />} name="password" required={true}
        >
          <TextInput type="password" name="password"/>
        </FormField>
        <FormField name="remember">
          <CheckBox name="remember" label={<LocalizedString id={root.remember} />}/>
        </FormField>
        <Box direction="row" justify="between" margin={{ top: "medium" }}>
          <Link href="/register">
            <Button label={<LocalizedString id={root.register} />} />
          </Link>
          <Button type="submit" label={<LocalizedString id={root.login} />} primary />
        </Box>
      </Form>
      <NotificationSystem ref={notificationRef} />
    </>
  );
};

export const LoginPage: React.FC = (props) => {
  return (
    <Box align="center" justify="center" pad="large">
      <Box width="medium" border="all" pad="medium">
        <LoginForm />
      </Box>
    </Box>
  );
};

export default LoginPage;
