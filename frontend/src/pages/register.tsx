import React, { useState } from "react";
import {
  Box, FormField,
  TextInput, Button, CheckBox, Heading,
} from "grommet";
import { prefix } from "src/i18n";
import { Localized } from "src/i18n";

import { api } from "src/apis";
import { useStore } from "simstate";
import { UserStore } from "src/stores/UserStore";
import Router from "next/router";
import { emailValidation } from "src/utils/validations/emailValidation";
import { useHttpRequest } from "src/utils/useHttpErrorHandler";
import { AnchorLink } from "src/components/AnchorLink";
import { toast } from "react-toastify";
import { Form } from "src/components/form/Form";
import { UserRole } from "src/models/User";

const root = prefix("register.");

const defaultValue = { email: "", password: "", remember: true };


const RegisterForm: React.FC = () => {
  const userStore = useStore(UserStore);
  const [value, setValue] = useState(defaultValue);
  const [inProgress, setInProgress] = useState(false);
  const request = useHttpRequest(setInProgress);

  const register = () => request(async () => {
    const { email, password, remember } = value;
    try {
      const res = await api.auth.register({ body: { email, password } });
      toast.success(
        <Localized id={root("success")} />
      );
      await Router.push("/");
      userStore.login({
        email: email,
        name: res.name,
        token: res.token,
        remember: remember,
        role: UserRole.User,
        id: res.userId,
      });
    } catch (e) {
      if (e.status === 405) {
        toast.error(
          <Localized id={root("conflict")} />
        );
      } else {
        throw e;
      }
    }
  });

  return (
    <Form value={value} onChange={setValue} onSubmit={register} validate="blur">
      <FormField label={<Localized id={root("email")} />} name="email" required={true}
        disabled={inProgress} validate={emailValidation}
      >
        <TextInput name="email" />
      </FormField>
      <FormField
        label={<Localized id={root("password")} />} name="password" required={true}
        disabled={inProgress}
      >
        <TextInput type="password" name="password"/>
      </FormField>
      <Box margin={{ vertical: "small" }}>
        <CheckBox
          disabled={inProgress}
          name="remember"
          label={<Localized id={root("remember")} />}
        />
      </Box>
      <Box>
        <Button
          type="submit"
          label={<Localized id={inProgress ? root("inProgress") : root("register")} />}
          primary={true}
          disabled={inProgress}
        />
      </Box>
      <Box direction="row" justify="center" margin={{ top: "small" }}>
        <AnchorLink href="/login">
          <Localized id={root("login")} />
        </AnchorLink>
      </Box>
    </Form>
  );
};

export const RegisterPage: React.FC = () => {
  return (
    <Box align="center" justify="center" pad="medium" flex="grow">
      <Box width="medium" border="all" pad="medium" elevation="small"  >
        <Heading alignSelf="center" level="2" margin="none">
          <Localized id={root("title")} />
        </Heading>
        <RegisterForm />
      </Box>
    </Box>
  );
};

export default RegisterPage;
