import React from "react";
import { Localized, prefix } from "src/i18n";
import { Text } from "grommet";

interface Props {
  commaToSplit: boolean;
}

const root = prefix("components.tagInput.");

export const TagInputInfo: React.FC<Props> = ({ commaToSplit }) => {
  return (
    <Text color="text-xweak">
      <Localized id={root("placeholder")} />
      { commaToSplit ? <Localized id={root("commaToSplit")} /> : undefined}
    </Text>

  );
};
