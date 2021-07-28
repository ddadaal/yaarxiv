import React from "react";
import { Paragraph } from "grommet";
import { Localized } from "src/i18n";
import { Send } from "grommet-icons";
import { prefix } from "src/i18n";
import { OperationCompletePage } from "src/components/OperationCompletePage";

const root = prefix("register.success.");

export const RegisterEmailSentPage: React.FC = () => {
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

export default RegisterEmailSentPage;
