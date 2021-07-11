import React from "react";
import { Localized } from "src/i18n";
import { prefix } from "src/i18n";

interface Props {
  publicity: boolean;
}

const root = prefix("components.publicitySelect.");

export const PublicityText: React.FC<Props> = ({ publicity }) => {
  return (
    <Localized id={publicity ? root("public") : root("private")} />
  );
};
