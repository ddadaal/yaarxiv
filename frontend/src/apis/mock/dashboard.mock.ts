import { DashboardArticleInfo } from "yaarxiv-api/api/dashboard/getArticles";
import { realApi } from "../api";
import { makeHttpError } from "../fetch";

/* eslint-disable max-len */
const base: DashboardArticleInfo[] = [
  {
    id: 12312412,
    title: "AcademyCloud: A education-oriented IaaS cloud built on OpenStack",
    lastUpdatedTime: "2020-08-06T01:16:41+00:00",
    createTime: "2020-08-06T01:16:41+00:00",
    revisionCount: 3,
    adminSetPublicity: true,
    ownerSetPublicity: false,
  },
  {
    id: 123123123,
    title: "Understanding the interleaving-space overlap across inputs and software versions",
    lastUpdatedTime: "2020-07-06T01:16:41+00:00",
    createTime: "2020-08-06T01:16:41+00:00",
    revisionCount: 3,
    adminSetPublicity: false,
    ownerSetPublicity: true,
  },
];

export const dashboardApisMock: typeof realApi["dashboard"] = ({
  userGetArticleInfo: async ({ query: { page = 1 } }) => {
    const start = (page - 1) * 10;
    return {
      articles: base.slice(start, start + 10),
      totalCount: base.length,
    };
  },
  dashboardGetProfile: async () => {
    return {
      userId: 123,
      email: "123@123.com",
      role: "user",
      name: "123name",
    };
  },
  changePassword: async ({ body: { current } }) => {
    if (current !== "1") {
      throw makeHttpError(403, null);
    }
    return null;
  },
  changeProfile: async () => null,

  changeArticleOwnerSetPublicity: async ({ body }) => ({ publicity: body.publicity }),
});
