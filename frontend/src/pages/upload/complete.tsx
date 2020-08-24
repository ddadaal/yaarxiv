import { Box } from "grommet";
import { useRouter } from "next/router";
import React from "react";
import { queryToString } from "src/utils/querystring";

export const UploadCompletePage: React.FC = () => {
  const router = useRouter();

  const articleId = queryToString(router.query.articleId);

  return (
    <Box justify="center" align="center">
      Upload successful.

      The id of your new article is {articleId}.

      Your article will be reviewed shortly.

      If the review is successful, it will be available publicly on our website.

      Thanks for your support.
    </Box>
  );

};

export default UploadCompletePage;
