import { Box, Heading } from "grommet";
import React from "react";
import { LocalizedString } from "simstate-i18n";
import { lang } from "src/i18n";
import { ArticleTable } from "src/pageComponents/Dashboard/ArticleTable";
import { requireAuth } from "src/utils/requireAuth";

const root = lang.pages.dashboard;


const DashboardPage = requireAuth({ roles: ["user"]})(({ }) => {

  return (
    <Box>
      <Box gap="medium">
        <Heading level={1} size="small" margin="none">
          <LocalizedString id={root.articles.title} />
        </Heading>
        <ArticleTable/>
      </Box>
    </Box>
  );
});

export default DashboardPage;
