import { Box, Heading } from "grommet";
import React from "react";
import { useAsync } from "react-async";
import { LocalizedString } from "simstate-i18n";
import { getApi } from "src/apis";
import { articleApis } from "src/apis/article";
import { dashboardApis } from "src/apis/dashboard";
import { requireAuth } from "src/components/RequireAuth";
import { lang } from "src/i18n";
import { ArticleTable } from "src/pageComponents/Dashboard/ArticleTable";

const root = lang.pages.dashboard;

const dashboardApi = getApi(dashboardApis);
const articleApi = getApi(articleApis);

const getDashboardData = () => dashboardApi.getArticles({}).then((x) => x.articles);
const deleteArticle = (articleId: string) =>
  articleApi.deleteArticle({ path: { articleId } });

const DashboardPage = requireAuth()(({ userStore }) => {

  const { data, isPending, reload } = useAsync({ promiseFn: getDashboardData });

  return (
    <Box>
      <Box gap="medium">
        <Heading level={1} size="small" margin="none">
          <LocalizedString id={root.articles.title} />
        </Heading>
        <ArticleTable
          data={data!}
          loading={isPending}
          reload={reload}
          deleteArticle={deleteArticle}
        />
      </Box>
    </Box>
  );
});

export default DashboardPage;
