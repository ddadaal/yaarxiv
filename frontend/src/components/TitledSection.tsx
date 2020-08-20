import React from "react";
import { BoxProps, Box, Heading } from "grommet";
import { Section } from "./Section";

interface Props extends BoxProps {
  titleId: string;
}

export const TitledSection: React.FC<Props> = ({
  titleId,
  children,
  ...rest
}) => {
  return (
    <Section {...rest}>
      <Heading level={3} margin="none">{titleId}</Heading>
      <Box>
        {children}
      </Box>
    </Section>
  );
};
