/* eslint-disable max-len */
import { DashboardArticleInfo } from "yaarxiv-api/dashboard/getArticles";
import { MockApi } from ".";
import { dashboardApis } from "./dashboard";

const mockArticles: DashboardArticleInfo[] = [
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


export const dashboardApisMock: MockApi<typeof dashboardApis> = () => ({ getArticles: async () => ({ articles: mockArticles }) });
