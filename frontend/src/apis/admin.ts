/* eslint-disable max-len */
import * as getArticles from "yaarxiv-api/admin/getArticles";
import * as getUsers from "yaarxiv-api/admin/getUsers";
import * as deleteUser from "yaarxiv-api/admin/deleteUser";
import * as changeArticlePublicity from "yaarxiv-api/admin/changeArticlePublicity";
import { fromApi } from "./fetch";

export const adminApis = () => ({
  getArticles: fromApi<getArticles.AdminGetArticlesSchema>(getArticles.endpoint),
  getUsers: fromApi<getUsers.AdminGetUsersSchema>(getUsers.endpoint),
  deleteUser: fromApi<deleteUser.AdminDeleteArticleSchema>(deleteUser.endpoint),
  changeArticlePublicity: fromApi<changeArticlePublicity.ChangeArticleAdminSetPublicitySchema>(changeArticlePublicity.endpoint),
});
