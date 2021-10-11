/* eslint-disable max-len */
import { Box } from "grommet";
import router from "next/router";
import { api } from "src/apis";
import { prefix } from "src/i18n";
import { UserRole } from "src/models/User";
import { ArticleTable } from "src/pageComponents/Dashboard/ArticleTable";
import { DashboardLayout } from "src/pageComponents/Dashboard/DashboardLayout";
import { SectionTitle } from "src/pageComponents/Dashboard/SectionTitle";
import { queryToIntOrDefault } from "src/utils/querystring";
import { ssrPage } from "src/utils/ssr";
import { UserGetArticleInfoSchema } from "yaarxiv-api/api/dashboard/getArticles";

const root = prefix("pages.dashboard.");

interface Props {
  page: number;
  data: UserGetArticleInfoSchema["responses"]["200"];
}

export const ArticlesPage = ssrPage<Props>(({ page, data }) => {

  return (
    <DashboardLayout titleId={root("articles.title")}>
      <Box>
        <SectionTitle titleId={root("articles.title")} />
        <ArticleTable
          page={page}
          data={data}
          reload={() => router.replace(router.asPath)}
          getUrlOfPage={(p) => ({ pathname: "/dashboard/articles", query:{ page: p } })}
        />
      </Box>
    </DashboardLayout>
  );
}, async (ctx) => {

  const page = queryToIntOrDefault(ctx.query.page, 1);

  const result = await api.dashboard.userGetArticleInfo({ query: { page } });

  return {
    page,
    data: result,
  };

}, { authOptions: { roles: [UserRole.User]} });

export default ArticlesPage;
