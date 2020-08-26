/* eslint-disable max-len */
import { MockApi } from ".";
import { adminApis } from "./admin";
import { AdminGetArticlesResult } from "yaarxiv-api/admin/getArticles";

const mockArticles: AdminGetArticlesResult[] = [
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

export const adminApisMock: MockApi<typeof adminApis> = () => ({
  getArticles: async () => ({
    articles: mockArticles,
    totalCount: mockArticles.length,
  }),
});
