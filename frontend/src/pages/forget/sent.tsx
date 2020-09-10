import React from "react";
import { Paragraph } from "grommet";
import { LocalizedString } from "simstate-i18n";
import { Send } from "grommet-icons";
import { lang } from "src/i18n";
import { OperationCompletePage } from "src/components/OperationCompletePage";

const root = lang.forgetPassword.sent;

export const ForgetPasswordMailSentPage: React.FC = () => {
  return (
    <OperationCompletePage
      titleId={root.title}
      icon={<Send color="status-ok" />}
    >
      <Paragraph>
        <LocalizedString id={root.description} />
      </Paragraph>
    </OperationCompletePage>
  );
};

export default ForgetPasswordMailSentPage;
