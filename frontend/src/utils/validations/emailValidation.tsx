import React from "react";
import { LocalizedString } from "simstate-i18n";
import { lang } from "src/i18n";
import { Text } from "grommet";

const root = lang.components.form.validationError;

export const emailValidation = {
  // eslint-disable-next-line max-len
  regexp: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  message: <Text color="status-error"><LocalizedString id={root.email} /></Text>,
  status: "error",
} as const;
