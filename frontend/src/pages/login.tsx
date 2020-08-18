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
import { useRouter } from "next/router";
import { useNotification } from "src/components/useNotification";
import { emailMask } from "src/styles/inputMasks";

const root = lang.login;

const defaultValue = { id: "", password: "", remember: true };

const api = getApi(authApis);

const LoginForm: React.FC = () => {
  const userStore = useStore(UserStore);
  const [value, setValue] = useState(defaultValue);
  const [inProgress, setInProgress] = useState(false);
  const notification = useNotification();
  const router = useRouter();

  const login = async () => {
    const { id, password, remember } = value;
    setInProgress(true);
    try {
      const res = await api.login({ id, password }, undefined);
      userStore.login({
        userId: id,
        name: res.name,
        token: res.token,
        remember: remember,
      });
      router.push("/");
    } catch ({ status }) {
      if (status === 403) {
        notification.addNotification({
          message: "Your username and password is invalid",
          level: "error",
          position: "tc",
        });
      }
    }
    setInProgress(false);
  };

  return (
    <Form value={value} onChange={setValue} onSubmit={login}>
      <FormField label={<LocalizedString id={root.id} />} name="id" required={true}
        disabled={inProgress}
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
