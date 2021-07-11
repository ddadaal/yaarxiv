import { Box, Heading } from "grommet";
import React from "react";
import { Localized, prefix, Id } from "src/i18n";
import { ArticleTable } from "src/pageComponents/Dashboard/ArticleTable";
import { requireAuth } from "src/utils/requireAuth";
import { UserProfile } from "src/pageComponents/Dashboard/UserProfile";
import { UserRole } from "src/models/User";

const root = prefix("pages.dashboard.");

const DashboardSection: React.FC<{ titleId: Id }> = ({
  children,
  titleId,
}) => {
  return (
    <Box>
      <Heading level={1} size="small" margin={{ horizontal: "small", vertical: "none" }}>
        <Localized id={titleId} />
      </Heading>
      {children}
    </Box>
  );
};


const DashboardPage = requireAuth({ roles: [UserRole.User]})(({ userStore }) => {

  return (
    <Box gap="xlarge">
      <DashboardSection titleId={root("profile.title")}>
        <UserProfile userStore={userStore} />
      </DashboardSection>
      <DashboardSection titleId={root("articles.title")}>
        <ArticleTable />
      </DashboardSection>
    </Box>
  );
});

export default DashboardPage;
