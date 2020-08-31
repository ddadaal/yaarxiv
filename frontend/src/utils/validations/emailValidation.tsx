import React from "react";
import { LocalizedString } from "simstate-i18n";
import { lang } from "src/i18n";
import { Text } from "grommet";

const root = lang.components.form.validationError;

export const emailValidation = {
  regexp: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  message: <Text color="status-error"><LocalizedString id={root.email} /></Text>,
  status: "error",
} as const;
