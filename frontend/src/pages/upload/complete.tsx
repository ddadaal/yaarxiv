import { Box, Heading, Paragraph } from "grommet";
import { useRouter } from "next/router";
import React from "react";
import { Localized, prefix } from "src/i18n";
import { queryToString } from "src/utils/querystring";
import { Checkmark } from "grommet-icons";
import { requireAuth } from "src/utils/requireAuth";
import { UserRole } from "src/models/User";

const root = prefix("pages.upload.complete.");

export const UploadCompletePage = requireAuth({ roles: [UserRole.User]})(() => {
  const router = useRouter();

  const articleId = queryToString(router.query.articleId);

  return (
    <Box justify="center" align="center">
      <Heading level={1} size="small">
        <Checkmark color="status-ok" />
        <Localized id={root("title")} />
      </Heading>

      <Paragraph fill>
        <Localized
          id={root("description")}
          args={[articleId]}
        />
      </Paragraph>
    </Box>
  );
});

export default UploadCompletePage;
