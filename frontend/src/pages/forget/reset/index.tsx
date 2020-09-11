import * as React from "react";
import { NextPage } from "next";
import { lang } from "src/i18n";
import Router from "next/router";
import { getApi } from "src/apis";
import { authApis } from "src/apis/auth";
import { SSRPageProps } from "src/utils/ssr";
import { Close } from "grommet-icons";
import { ErrorPage } from "src/components/errors/ErrorPage";
import { LocalizedString } from "simstate-i18n";
import { useHttpRequest } from "src/utils/useHttpErrorHandler";
import { HttpError } from "src/apis/fetch";
import { Form, FormField, Box, Button, Text, Heading } from "grommet";
import { queryToString } from "src/utils/querystring";
import { UnifiedErrorPage } from "src/components/errors/UnifiedErrorPage";

type Props = SSRPageProps<{
  token: string;
  valid: boolean;
}>;

const root = lang.forgetPassword.reset;

const api = getApi(authApis);

const initial = {
  changed: "",
  confirmChanged: "",
};

const ResetPasswordForm: React.FC<{ token: string}> = ({ token }) => {

  const [form, setForm] = React.useState(initial);

  const error =
    form.changed && form.confirmChanged
    && form.changed !== form.confirmChanged
      ? <LocalizedString id={root.notMatch} />
      : undefined;

  const [loading, setLoading] = React.useState(false);
  const request = useHttpRequest(setLoading);

  const submit = () => request(async ({ notification }) => {
    if (error) { return; }
    await api.resetPassword({
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
          notification.addNotification({
            level: "error",
            title: <LocalizedString id={root.error.title} />,
            message: <LocalizedString id={root.error.description} />,
          });
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
        label={<LocalizedString id={root.password} />}
        type="password"
        required
      />
      <FormField
        name="confirmChanged"
        label={<LocalizedString id={root.confirm} />}
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
            <LocalizedString
              id={root.confirm}
            />
          }
          primary={true}
          disabled={loading}
        />
        <Button
          type="reset"
          label={<LocalizedString id={root.reset} />}
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
        titleId={root.error.title}
        Icon={Close}
        defaultDescriptionId={root.error.description}
      />
    );

  }

  return (
    <Box align="center" justify="center" pad="medium" flex="grow">
      <Box width="medium" border="all" pad="medium" elevation="small">
        <Heading alignSelf="center" level="2" margin="none">
          <LocalizedString id={root.title} />
        </Heading>
        <ResetPasswordForm token={props.token}  />
      </Box>
    </Box>
  );
};

PasswordResetPage.getInitialProps = async (ctx) => {
  const token = queryToString(ctx.query.token);

  const resp = await api.validatePasswordResetToken({ query: { token } })
    .catch((e: HttpError) => ({ error: e }));

  return "error" in resp
    ? resp
    : {
      valid: resp.valid,
      token,
    };
};

export default PasswordResetPage;
