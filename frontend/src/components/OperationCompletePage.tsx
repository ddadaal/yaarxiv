import React from "react";
import { Box, Heading } from "grommet";
import { Id, Localized } from "src/i18n";
import { I18nTitle } from "src/i18n/I18nTitle";

interface Props {
  icon: React.ReactNode;
  titleId: Id;
}

export const OperationCompletePage: React.FC<Props> = ({
  icon,
  titleId,
  children,
}) => {
  return (
    <Box justify="center" align="center">
      <I18nTitle id={titleId} />
      <Box direction="row" gap="small" align="center" justify="center">
        {icon}
        <Heading level={1} size="small">
          <Localized id={titleId} />
        </Heading>
      </Box>
      {children}
    </Box>
  );
};
