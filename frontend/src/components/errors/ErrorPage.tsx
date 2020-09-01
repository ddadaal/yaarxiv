import { Box, Heading, Paragraph, Text } from "grommet";
import { IconProps  } from "grommet-icons";
import React from "react";
import { LocalizedString } from "simstate-i18n";

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
    <Box justify="center" align="center">
      <Box direction="row" gap="small" align="center" justify="center">
        <Icon color="status-error" />
        <Heading level={1} size="small">
          <LocalizedString id={titleId} />
        </Heading>
      </Box>
      <Paragraph>
        {
          description ??
          <LocalizedString id={defaultDescriptionId}/>
        }
      </Paragraph>
      {children}
    </Box>
  );
};




