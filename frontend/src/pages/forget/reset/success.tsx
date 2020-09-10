import React from "react";
import { OperationCompletePage } from "src/components/OperationCompletePage";
import { lang } from "src/i18n";
import { Checkmark } from "grommet-icons";
import { Paragraph } from "grommet";
import { LocalizedString } from "simstate-i18n";
import { AnchorLink } from "src/components/AnchorLink";

const root = lang.forgetPassword.reset.complete;

export const PasswordResetSuccessPage: React.FC = () => {
  return (
    <OperationCompletePage
      titleId={root.title}
      icon={<Checkmark color="status-ok" />}
    >
      <Paragraph>
        <LocalizedString
          id={root.description}
          replacements={[
            <AnchorLink key="loginLink" href={"/login"}>
              <LocalizedString id={root.loginLink} />
            </AnchorLink>,
          ]}
        />
      </Paragraph>
    </OperationCompletePage>


  );
};

export default PasswordResetSuccessPage;
