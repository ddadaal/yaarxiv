import { Paragraph } from "grommet";
import { IconProps  } from "grommet-icons";
import React from "react";
import { Id, Localized } from "src/i18n";
import { OperationCompletePage } from "../OperationCompletePage";

export interface Props {
  titleId: Id;
  defaultDescriptionId: Id;
  description?: React.ReactNode;
  Icon: React.ComponentType<IconProps>;
}

export const ErrorPage: React.FC<Props> = ({
  titleId,
  defaultDescriptionId,
  description,
  Icon,
  children,
}) => {
  return (
    <OperationCompletePage
      titleId={titleId}
      icon={<Icon color="status-error" />}
    >
      <Paragraph>
        {
          description ??
          <Localized id={defaultDescriptionId}/>
        }
      </Paragraph>
      {children}
    </OperationCompletePage>
  );
};




