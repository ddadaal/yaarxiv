import React from "react";
import { LocalizedString } from "simstate-i18n";
import { lang } from "src/i18n";
import { Text } from "grommet";
import { ACCEPTABLE_CODE_SITES, getCodeLinkInfo } from "yaarxiv-api/utils/codeLink";
export { ACCEPTABLE_CODE_SITES, getCodeLinkInfo };

const root = lang.components.form.validationError;

export const codeLinkValidation = (value: string) => {

  const info = getCodeLinkInfo(value);

  if (!info) {
    return {
      message: (
        <Text color="status-error">
          <LocalizedString
            id={root.codeLink}
            replacements={[Object.values(ACCEPTABLE_CODE_SITES).join(", ")]}
          />
        </Text>
      ),
      status: "error",
    } as const;
  }
};


