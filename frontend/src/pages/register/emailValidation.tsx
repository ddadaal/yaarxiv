import { HttpError } from "src/apis/fetch";
import { queryToString } from "src/utils/querystring";
import { ssrPage } from "src/utils/ssr";
import { api } from "src/apis";
import { Localized, prefix } from "src/i18n";
import { OperationCompletePage } from "src/components/OperationCompletePage";
import { Paragraph } from "grommet";
import { AnchorLink } from "src/components/AnchorLink";
import { Close, Validate } from "grommet-icons";

const root = prefix("register.emailValidation.");

interface Props {
  success: boolean;
}

export const EmailValidationPage = ssrPage<Props>(({ success }) => {

  if (success) {
    return (
      <OperationCompletePage
        titleId={root("success.title")}
        icon={<Validate color="status-ok" />}
      >
        <Paragraph>
          <Localized id={root("success.description")} args={[
            <AnchorLink href="/login" key="loginLink">
              <Localized id={root("success.loginLink")} />
            </AnchorLink>,
          ]}
          />
        </Paragraph>
      </OperationCompletePage>
    );
  } else {
    return (
      <OperationCompletePage
        titleId={root("failure.title")}
        icon={<Close color="status-critical" />}
      >
        <Paragraph>
          <Localized id={root("failure.description")} />
        </Paragraph>
      </OperationCompletePage>
    );

  }
}, async (ctx) => {
  const token = queryToString(ctx.query.token);

  const result = await api.register.validateEmail({ body: { token } })
    .then(() => ({ success: true }))
    .catch((e: HttpError) => {
      if (e.status === 403) {
        return { success: false };
      }  else {
        throw e;
      }
    });

  return result;
});

export default EmailValidationPage;
