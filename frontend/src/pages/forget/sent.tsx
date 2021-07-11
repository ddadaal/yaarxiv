import React from "react";
import { Paragraph } from "grommet";
import { Localized } from "src/i18n";
import { Send } from "grommet-icons";
import { prefix } from "src/i18n";
import { OperationCompletePage } from "src/components/OperationCompletePage";

const root = prefix("forgetPassword.sent.");

export const ForgetPasswordMailSentPage: React.FC = () => {
  return (
    <OperationCompletePage
      titleId={root("title")}
      icon={<Send color="status-ok" />}
    >
      <Paragraph>
        <Localized id={root("description")} />
      </Paragraph>
    </OperationCompletePage>
  );
};

export default ForgetPasswordMailSentPage;
