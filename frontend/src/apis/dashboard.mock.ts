/* eslint-disable max-len */
import type { DashboardArticleInfo } from "yaarxiv-api/dashboard/getArticles";
import type { MockApi } from ".";
import type { dashboardApis } from "./dashboard";
import { makeHttpError } from "./fetch";

const base: DashboardArticleInfo[] = [
  {
    id: "12312412",
    title: "AcademyCloud: A education-oriented IaaS cloud built on OpenStack",
    lastUpdatedTime: "2020-08-06T01:16:41+00:00",
    createTime: "2020-08-06T01:16:41+00:00",
    revisionCount: 3,
    adminSetPublicity: true,
    ownerSetPublicity: false,
  },
  {
    id: "dashboard123123123",
    title: "Understanding the interleaving-space overlap across inputs and software versions",
    lastUpdatedTime: "2020-07-06T01:16:41+00:00",
    createTime: "2020-08-06T01:16:41+00:00",
    revisionCount: 3,
    adminSetPublicity: false,
    ownerSetPublicity: true,
  },
];

export const dashboardApisMock: MockApi<typeof dashboardApis> = () => ({
  getArticles: async ({ query: { page = 1 } }) => {
    const start = (page - 1) * 10;
    return {
      articles: base.slice(start, start + 10),
      totalCount: base.length,
    };
  },
  getProfile: async () => {
    return {
      userId: "123",
      email: "123@123.com",
      role: "user",
      name: "123name",
    };
  },
  changePassword: async ({ body: { current, changed } }) => {
    if (current !== "1") {
      throw makeHttpError({}, 403);
    }
    return {};
  },
  changeProfile: async () => ({}),
  changeArticlePublicity: async ({ body }) => ({ publicity: body.publicity }),
});
