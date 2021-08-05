import React from "react";
import { Id, Localized } from "src/i18n";
import { Text } from "grommet";

interface Props {
  id: Id;
  args?: React.ReactNode[];
}

export const FormFieldMessage: React.FC<Props> = ({ id, args }) => {
  return (
    <Text color="status-error">
      <Localized
        id={id}
        args={args}
      />
    </Text>
  );
};
