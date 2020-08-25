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
import { useNotification } from "src/utils/useNotification";
import { emailMask } from "src/styles/inputMasks";

const root = lang.register;

const defaultValue = { email: "", password: "", remember: true };

const api = getApi(authApis);

const RegisterForm: React.FC = () => {
  const userStore = useStore(UserStore);
  const [value, setValue] = useState(defaultValue);
  const [inProgress, setInProgress] = useState(false);
  const notification = useNotification();
  const router = useRouter();

  const login = async () => {
    const { email, password, remember } = value;
    setInProgress(true);
    try {
      const res = await api.register({ body: { email, password } });
      userStore.login({
        userId: email,
        name: res.name,
        token: res.token,
        remember: remember,
      });
      router.push("/");
    } catch ({ status }) {
      if (status === 405) {
        notification.addNotification({
          message: "The email have been used. Change an email.",
          level: "error",
          position: "tc",
        });
      }
    }

    setInProgress(false);
  };

  return (
    <Form value={value} onChange={setValue} onSubmit={login}>
      <FormField label={<LocalizedString id={root.email} />} name="email" required={true}
        disabled={inProgress}
      >
        <MaskedInput mask={emailMask} name="email"/>
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
        <Link href="/login">
          <Button label={<LocalizedString id={root.login} />}
            disabled={inProgress}
          />
        </Link>
        <Button
          type="submit"
          label={<LocalizedString id={inProgress ? root.inProgress : root.register} />}
          primary={true}
          disabled={inProgress}
        />
      </Box>
    </Form>
  );
};

export const RegisterPage: React.FC = () => {
  return (
    <Box align="center" justify="center" pad="medium" flex="grow">
      <Box width="medium" border="all" pad="medium" elevation="small"  >
        <Heading alignSelf="center" level="2" margin="none">
          <LocalizedString id={root.title} />
        </Heading>
        <RegisterForm />
      </Box>
    </Box>
  );
};

export default RegisterPage;
