/* eslint-disable max-len */
import { fromApi } from "./fetch";

import * as changeArticleAdminSetPublicity from "yaarxiv-api/api/admin/changeArticlePublicity";
import * as adminDeleteUser from "yaarxiv-api/api/admin/deleteUser";
import * as adminGetArticles from "yaarxiv-api/api/admin/getArticles";
import * as adminGetUsers from "yaarxiv-api/api/admin/getUsers";
import * as deleteArticle from "yaarxiv-api/api/article/delete";
import * as getArticle from "yaarxiv-api/api/article/get";
import * as getArticleScript from "yaarxiv-api/api/article/getScript";
import * as getArticleScriptDownloadToken from "yaarxiv-api/api/article/getScriptDownloadToken";
import * as retractArticle from "yaarxiv-api/api/article/retract";
import * as searchArticle from "yaarxiv-api/api/article/search";
import * as updateArticle from "yaarxiv-api/api/article/update";
import * as uploadArticle from "yaarxiv-api/api/article/upload";
import * as uploadScript from "yaarxiv-api/api/article/uploadScript";
import * as login from "yaarxiv-api/api/auth/login";
import * as requestPasswordReset from "yaarxiv-api/api/auth/requestPasswordReset";
import * as resetPassword from "yaarxiv-api/api/auth/resetPassword";
import * as validatePasswordResetToken from "yaarxiv-api/api/auth/validatePasswordResetToken";
import * as changeAccountInfo from "yaarxiv-api/api/dashboard/changeAccountInfo";
import * as changeArticleOwnerSetPublicity from "yaarxiv-api/api/dashboard/changeArticlePublicity";
import * as changePassword from "yaarxiv-api/api/dashboard/changePassword";
import * as changeProfile from "yaarxiv-api/api/dashboard/changeProfile";
import * as getAccountInfo from "yaarxiv-api/api/dashboard/getAccountInfo";
import * as userGetArticleInfo from "yaarxiv-api/api/dashboard/getArticles";
import * as getProfile from "yaarxiv-api/api/dashboard/getProfile";
import * as register from "yaarxiv-api/api/register/register";
import * as validateEmail from "yaarxiv-api/api/register/validateEmail";
import * as queryIfSetup from "yaarxiv-api/api/setup/queryIfSetup";
import * as setup from "yaarxiv-api/api/setup/setup";

export const realApi = {
  admin: {
    changeArticleAdminSetPublicity: fromApi(changeArticleAdminSetPublicity.endpoint),
    adminDeleteUser: fromApi(adminDeleteUser.endpoint),
    adminGetArticles: fromApi(adminGetArticles.endpoint),
    adminGetUsers: fromApi(adminGetUsers.endpoint),
  },
  article: {
    deleteArticle: fromApi(deleteArticle.endpoint),
    getArticle: fromApi(getArticle.endpoint),
    getArticleScript: fromApi(getArticleScript.endpoint),
    getArticleScriptDownloadToken: fromApi(getArticleScriptDownloadToken.endpoint),
    retractArticle: fromApi(retractArticle.endpoint),
    searchArticle: fromApi(searchArticle.endpoint),
    updateArticle: fromApi(updateArticle.endpoint),
    uploadArticle: fromApi(uploadArticle.endpoint),
    uploadScript: fromApi(uploadScript.endpoint),
  },
  auth: {
    login: fromApi(login.endpoint),
    requestPasswordReset: fromApi(requestPasswordReset.endpoint),
    resetPassword: fromApi(resetPassword.endpoint),
    validatePasswordResetToken: fromApi(validatePasswordResetToken.endpoint),
  },
  dashboard: {
    changeAccountInfo: fromApi(changeAccountInfo.endpoint),
    changeArticleOwnerSetPublicity: fromApi(changeArticleOwnerSetPublicity.endpoint),
    changePassword: fromApi(changePassword.endpoint),
    changeProfile: fromApi(changeProfile.endpoint),
    getAccountInfo: fromApi(getAccountInfo.endpoint),
    userGetArticleInfo: fromApi(userGetArticleInfo.endpoint),
    getProfile: fromApi(getProfile.endpoint),
  },
  register: {
    register: fromApi(register.endpoint),
    validateEmail: fromApi(validateEmail.endpoint),
  },
  setup: {
    queryIfSetup: fromApi(queryIfSetup.endpoint),
    setup: fromApi(setup.endpoint),
  },
};
