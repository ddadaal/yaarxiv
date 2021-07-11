import React from "react";
import { OperationCompletePage } from "src/components/OperationCompletePage";
import { Checkmark } from "grommet-icons";
import { Paragraph } from "grommet";
import { Localized, prefix } from "src/i18n";
import { AnchorLink } from "src/components/AnchorLink";

const root = prefix("forgetPassword.reset.complete.");

export const PasswordResetSuccessPage: React.FC = () => {
  return (
    <OperationCompletePage
      titleId={root("title")}
      icon={<Checkmark color="status-ok" />}
    >
      <Paragraph>
        <Localized
          id={root("description")}
          args={[
            <AnchorLink key="loginLink" href={"/login"}>
              <Localized id={root("loginLink")} />
            </AnchorLink>,
          ]}
        />
      </Paragraph>
    </OperationCompletePage>


  );
};

export default PasswordResetSuccessPage;
