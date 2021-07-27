/* eslint-disable max-len */
import { Box, Heading } from "grommet";
import React from "react";
import { Localized, prefix } from "src/i18n";
import { ArticleTable } from "src/pageComponents/Dashboard/ArticleTable";
import { DashboardLayout } from "src/pageComponents/Dashboard/DashboardLayout";

const root = prefix("pages.dashboard.");

export const ArticlesPage = () => {

  return (
    <DashboardLayout>
      <Box>
        <Heading level={1}>
          <Localized id={root("articles.title")} />
        </Heading>
        <ArticleTable />
      </Box>
    </DashboardLayout>
  );
};

export default ArticlesPage;
