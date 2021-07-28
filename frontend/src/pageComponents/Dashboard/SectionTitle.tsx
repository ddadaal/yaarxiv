import { Heading } from "grommet";
import React from "react";
import { Id, Localized } from "src/i18n";

interface Props {
  titleId: Id;
}

export const SectionTitle: React.FC<Props> = ({ titleId }) => {
  return (
    <Heading level={2}>
      <Localized id={titleId} />
    </Heading>
  );
};
