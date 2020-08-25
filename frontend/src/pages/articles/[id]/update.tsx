import { Box } from "grommet";
import { useRouter } from "next/router";
import React from "react";

export const ArticleUpdatePage: React.FC = () => {

  const router = useRouter();

  return (
    <Box>
      edit article.
    </Box>
  );
};

export default ArticleUpdatePage;
