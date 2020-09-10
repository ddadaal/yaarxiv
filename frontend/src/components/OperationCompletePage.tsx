import React from "react";
import { Box, Heading, Paragraph } from "grommet";
import { LocalizedString } from "simstate-i18n";

interface Props {
  icon: React.ReactNode;
  titleId: string;
}

export const OperationCompletePage: React.FC<Props> = ({
  icon,
  titleId,
  children,
}) => {
  return (
    <Box justify="center" align="center">
      <Box direction="row" gap="small" align="center" justify="center">
        {icon}
        <Heading level={1} size="small">
          <LocalizedString id={titleId} />
        </Heading>
      </Box>
      {children}
    </Box>
  );
};
