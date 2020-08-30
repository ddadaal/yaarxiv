import { Box, Heading, Paragraph } from "grommet";
import { IconProps  } from "grommet-icons";
import React from "react";
import { LocalizedString } from "simstate-i18n";

export interface Props {
  titleId: string;
  descriptionId: string;
  Icon: React.ComponentType<IconProps>;
}

export const ErrorPage: React.FC<Props> = ({
  titleId,
  descriptionId,
  Icon,
  children,
}) => {
  return (
    <Box justify="center" align="center">
      <Heading level={1} size="small">
        <Icon color="status-error" />
        <LocalizedString id={titleId} />
      </Heading>
      <Paragraph>
        <LocalizedString
          id={descriptionId}
        />
      </Paragraph>
      {children}
    </Box>
  );
};




