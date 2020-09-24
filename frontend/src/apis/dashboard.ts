/* eslint-disable max-len */
import * as getArticles from "yaarxiv-api/dashboard/getArticles";
import * as getProfile from "yaarxiv-api/dashboard/getProfile";
import * as changePassword from "yaarxiv-api/dashboard/changePassword";
import * as changeProfile from "yaarxiv-api/dashboard/changeProfile";
import * as changeArticlePublicity from "yaarxiv-api/dashboard/changeArticlePublicity";
import { fromApi } from "./fetch";

export const dashboardApis = () => ({
  getArticles: fromApi<getArticles.UserGetArticleInfoSchema>(getArticles.endpoint),
  getProfile: fromApi<getProfile.DashboardGetProfileSchema>(getProfile.endpoint),
  changePassword: fromApi<changePassword.ChangePasswordSchema>(changePassword.endpoint),
  changeProfile: fromApi<changeProfile.ChangeProfileSchema>(changeProfile.endpoint),
  changeArticlePublicity: fromApi<changeArticlePublicity.ChangeArticleOwnerSetPublicitySchema>(changeArticlePublicity.endpoint),
});
