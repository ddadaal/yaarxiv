import React from "react";
import { Localized } from "src/i18n";
import { prefix } from "src/i18n";
import { Text } from "grommet";
import { ACCEPTABLE_CODE_SITES, getCodeLinkInfo } from "yaarxiv-api/api/utils/codeLink";
export { ACCEPTABLE_CODE_SITES, getCodeLinkInfo };

const root = prefix("components.form.validationError.");

export const codeLinkValidation = (value: string) => {

  const info = getCodeLinkInfo(value);

  if (!info) {
    return {
      message: (
        <Text color="status-error">
          <Localized
            id={root("codeLink")}
            args={[Object.values(ACCEPTABLE_CODE_SITES).join(", ")]}
          />
        </Text>
      ),
      status: "error",
    } as const;
  }
};


