/* eslint-disable max-len */
import { Box } from "grommet";
import React from "react";
import { prefix } from "src/i18n";
import { ArticleTable } from "src/pageComponents/Dashboard/ArticleTable";
import { DashboardLayout } from "src/pageComponents/Dashboard/DashboardLayout";
import { SectionTitle } from "src/pageComponents/Dashboard/SectionTitle";

const root = prefix("pages.dashboard.");

export const ArticlesPage = () => {

  return (
    <DashboardLayout>
      <Box>
        <SectionTitle titleId={root("articles.title")} />
        <ArticleTable />
      </Box>
    </DashboardLayout>
  );
};

export default ArticlesPage;
