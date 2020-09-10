import { Paragraph } from "grommet";
import { IconProps  } from "grommet-icons";
import React from "react";
import { LocalizedString } from "simstate-i18n";
import { OperationCompletePage } from "../OperationCompletePage";

export interface Props {
  titleId: string;
  defaultDescriptionId: string;
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
          <LocalizedString id={defaultDescriptionId}/>
        }
      </Paragraph>
      {children}
    </OperationCompletePage>
  );
};




