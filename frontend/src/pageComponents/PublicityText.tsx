import React from "react";
import { LocalizedString } from "simstate-i18n";
import { lang } from "src/i18n";

interface Props {
  publicity: boolean;
}

const root = lang.components.publicitySelect;

export const PublicityText: React.FC<Props> = ({ publicity }) => {
  return (
    <LocalizedString id={publicity ? root.public : root.private} />
  );
};
