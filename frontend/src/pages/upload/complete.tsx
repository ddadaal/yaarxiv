import { Box, Heading, Paragraph } from "grommet";
import { useRouter } from "next/router";
import React from "react";
import { LocalizedString } from "simstate-i18n";
import { lang } from "src/i18n";
import { queryToString } from "src/utils/querystring";
import { Checkmark } from "grommet-icons";
import { requireAuth } from "src/components/RequireAuth";

const root = lang.pages.upload.complete;

export const UploadCompletePage = requireAuth()(() => {
  const router = useRouter();

  const articleId = queryToString(router.query.articleId);

  return (
    <Box justify="center" align="center">
      <Heading level={1} size="small">
        <Checkmark color="status-ok" />
        <LocalizedString id={root.title} />
      </Heading>

      <Paragraph fill>
        <LocalizedString
          id={root.description}
          replacements={[articleId]}
        />
      </Paragraph>
    </Box>
  );
});

export default UploadCompletePage;
