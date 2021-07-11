import React from "react";
import { BoxProps, Box, Heading } from "grommet";
import { Section } from "./Section";
import { Id, Localized } from "src/i18n";

interface Props extends BoxProps {
  titleId: Id;
}

export const TitledSection: React.FC<Props> = ({
  titleId,
  children,
  ...rest
}) => {
  return (
    <Section {...rest}>
      <Heading level={3} margin="none">
        <Localized id={titleId} />
      </Heading>
      <Box>
        {children}
      </Box>
    </Section>
  );
};
