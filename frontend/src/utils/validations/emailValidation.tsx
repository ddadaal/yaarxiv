import { prefix } from "src/i18n";
import { FormFieldMessage } from "src/components/form/FormFieldMessage";

const root = prefix("components.form.validationError.");

export const emailValidation = {
  // eslint-disable-next-line max-len
  regexp: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  message: <FormFieldMessage id={root("email")} />,
  status: "error",
} as const;
