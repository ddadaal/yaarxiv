import { Box, Heading } from "grommet";
import React from "react";
import { LocalizedString } from "simstate-i18n";
import { lang } from "src/i18n";
import { ArticleTable } from "src/pageComponents/Dashboard/ArticleTable";
import { requireAuth } from "src/utils/requireAuth";
import { UserProfile } from "src/pageComponents/Dashboard/UserProfile";

const root = lang.pages.dashboard;

const DashboardSection: React.FC<{ titleId: string }> = ({
  children,
  titleId,
}) => {
  return (
    <Box>
      <Heading level={1} size="small" margin={{ horizontal: "small", vertical: "none" }}>
        <LocalizedString id={titleId} />
      </Heading>
      {children}
    </Box>
  );
};


const DashboardPage = requireAuth({ roles: ["user"]})(({ userStore }) => {

  return (
    <Box gap="xlarge">
      <DashboardSection titleId={root.profile.title}>
        <UserProfile userStore={userStore} />
      </DashboardSection>
      <DashboardSection titleId={root.articles.title}>
        <ArticleTable />
      </DashboardSection>
    </Box>
  );
});

export default DashboardPage;
