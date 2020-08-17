import React, { useState } from "react";
import { Box, Form, FormField, TextInput, Button, CheckBox, MaskedInput } from "grommet";
import { lang } from "src/i18n";
import { LocalizedString } from "simstate-i18n";
import Link from "next/link";

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

const LoginForm: React.FC = () => {
  const [value, setValue] = useState(defaultValue);

  return (
    <Form value={value} onChange={setValue}>
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
