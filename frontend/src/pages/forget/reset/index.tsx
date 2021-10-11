import * as React from "react";
import { NextPage } from "next";
import { prefix } from "src/i18n";
import Router from "next/router";

import { SSRPageProps } from "src/utils/ssr";
import { Close } from "grommet-icons";
import { ErrorPage } from "src/components/errors/ErrorPage";
import { Localized } from "src/i18n";
import { useHttpRequest } from "src/utils/http";
import { HttpError } from "src/apis/fetch";
import { FormField, Box, Button, Text, Heading } from "grommet";
import { queryToString } from "src/utils/querystring";
import { UnifiedErrorPage } from "src/components/errors/UnifiedErrorPage";
import { toast } from "react-toastify";
import { Form } from "src/components/form/Form";
import { api } from "src/apis";
import { I18nTitle } from "src/i18n/I18nTitle";

type Props = SSRPageProps<{
  token: string;
  valid: boolean;
}>;

const root = prefix("forgetPassword.reset.");

const initial = {
  changed: "",
  confirmChanged: "",
};

const ResetPasswordForm: React.FC<{ token: string}> = ({ token }) => {

  const [form, setForm] = React.useState(initial);

  const error =
    form.changed && form.confirmChanged
    && form.changed !== form.confirmChanged
      ? <Localized id={root("notMatch")} />
      : undefined;

  const [loading, setLoading] = React.useState(false);
  const request = useHttpRequest(setLoading);

  const submit = () => request(async () => {
    if (error) { return; }
    await api.auth.resetPassword({
      body: {
        token,
        newPassword: form.changed,
      },
    })
      .then(() => {
        Router.push("/forget/reset/success");
      })
      .catch((e: HttpError) => {
        if (e.status === 403) {
          toast.error(
            <Text>
              <Localized id={root("error.title")} />{". "}
              <Localized id={root("error.description")} />
            </Text>,
          );
        } else {
          throw e;
        }
      });
  });

  return (
    <Form
      value={form}
      onChange={setForm}
      onReset={() => setForm(initial)}
      onSubmit={submit}
    >
      <FormField
        name="changed"
        label={<Localized id={root("password")} />}
        type="password"
        required
      />
      <FormField
        name="confirmChanged"
        label={<Localized id={root("confirm")} />}
        type="password"
        required
      />
      {error && (
        <Box pad={{ horizontal: "small" }}>
          <Text color="status-error">{error}</Text>
        </Box>
      )}
      <Box direction="row" gap="medium" margin={{ top: "medium" }}
        justify="between"
      >
        <Button
          type="submit"
          label={
            <Localized
              id={root("confirm")}
            />
          }
          primary={true}
          disabled={loading}
        />
        <Button
          type="reset"
          label={<Localized id={root("reset")} />}
          disabled={loading}
        />
      </Box>
    </Form>
  );
};

export const PasswordResetPage: NextPage<Props> = (props) => {
  if ("error" in props) {
    return <UnifiedErrorPage error={props.error} />;
  }

  if (!props.valid) {
    return (
      <ErrorPage
        titleId={root("error.title")}
        Icon={Close}
        defaultDescriptionId={root("error.description")}
      />
    );

  }

  return (
    <Box align="center" justify="center" pad="medium" flex="grow">
      <I18nTitle id={root("title")} />
      <Box width="medium" border="all" pad="medium" elevation="small">
        <Heading alignSelf="center" level="2" margin="none">
          <Localized id={root("title")} />
        </Heading>
        <ResetPasswordForm token={props.token}  />
      </Box>
    </Box>
  );
};

PasswordResetPage.getInitialProps = async (ctx) => {
  const token = queryToString(ctx.query.token);

  const resp = await api.auth.validatePasswordResetToken({ query: { token } })
    .catch((e: HttpError) => ({ error: e }));

  return "error" in resp
    ? resp
    : {
      valid: resp.valid,
      token,
    };
};

export default PasswordResetPage;
