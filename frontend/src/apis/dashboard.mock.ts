import { range } from "src/utils/array";
/* eslint-disable max-len */
import { DashboardArticleInfo } from "yaarxiv-api/dashboard/getArticles";
import { MockApi } from ".";
import { dashboardApis } from "./dashboard";

const base: DashboardArticleInfo[] = [
  {
    id: "12312412",
    title: "AcademyCloud: A education-oriented IaaS cloud built on OpenStack",
    lastUpdatedTime: "2020-08-06T01:16:41+00:00",
    createTime: "2020-08-06T01:16:41+00:00",
    revisionCount: 3,
  },
  {
    id: "sdad12312412",
    title: "Understanding the interleaving-space overlap across inputs and software versions",
    lastUpdatedTime: "2020-07-06T01:16:41+00:00",
    createTime: "2020-08-06T01:16:41+00:00",
    revisionCount: 3,
  },
];

const totalCount = 22;
const mockArticles = range(0, totalCount).map((x) => ({ ...base[x % 2], id: x + "" }));


export const dashboardApisMock: MockApi<typeof dashboardApis> = () => ({
  getArticles: async ({ query: { page = 1 } }) => {
    const start = (page - 1) * 10;
    return {
      articles: mockArticles.slice(start, start + 10),
      totalCount: totalCount,
    };
  },
});
