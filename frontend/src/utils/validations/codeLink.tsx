import React from "react";
import { prefix } from "src/i18n";
import { ACCEPTABLE_CODE_SITES, getCodeLinkInfo } from "yaarxiv-api/api/utils/codeLink";
import { FormFieldMessage } from "src/components/form/FormFieldMessage";

export { ACCEPTABLE_CODE_SITES, getCodeLinkInfo };

const root = prefix("components.form.validationError.");

export const codeLinkValidation = (value?: string) => {

  if (!value) { return undefined; }

  const info = getCodeLinkInfo(value);

  if (!info) {
    return {
      message: (
        <FormFieldMessage
          id={root("codeLink")}
        />
      ),
      status: "error",
    } as const;
  }
};


