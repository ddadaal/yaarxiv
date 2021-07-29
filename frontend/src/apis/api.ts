/* eslint-disable max-len */
import { fromApi } from "./fetch";

import * as changeArticleAdminSetPublicity from "yaarxiv-api/api/admin/changeArticlePublicity";
import * as adminDeleteUser from "yaarxiv-api/api/admin/deleteUser";
import * as adminGetArticles from "yaarxiv-api/api/admin/getArticles";
import * as adminGetUsers from "yaarxiv-api/api/admin/getUsers";
import * as deleteArticle from "yaarxiv-api/api/article/delete";
import * as getArticle from "yaarxiv-api/api/article/get";
import * as getArticleFile from "yaarxiv-api/api/article/getFile";
import * as searchArticle from "yaarxiv-api/api/article/search";
import * as updateArticle from "yaarxiv-api/api/article/update";
import * as uploadArticle from "yaarxiv-api/api/article/upload";
import * as uploadPDF from "yaarxiv-api/api/article/uploadPDF";
import * as login from "yaarxiv-api/api/auth/login";
import * as requestPasswordReset from "yaarxiv-api/api/auth/requestPasswordReset";
import * as resetPassword from "yaarxiv-api/api/auth/resetPassword";
import * as validatePasswordResetToken from "yaarxiv-api/api/auth/validatePasswordResetToken";
import * as changeAccountInfo from "yaarxiv-api/api/dashboard/changeAccountInfo";
import * as changeArticleOwnerSetPublicity from "yaarxiv-api/api/dashboard/changeArticlePublicity";
import * as changePassword from "yaarxiv-api/api/dashboard/changePassword";
import * as userGetArticleInfo from "yaarxiv-api/api/dashboard/getArticles";
import * as dashboardGetProfile from "yaarxiv-api/api/dashboard/getProfile";
import * as register from "yaarxiv-api/api/register/register";
import * as validateEmail from "yaarxiv-api/api/register/validateEmail";

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
    getArticleFile: fromApi(getArticleFile.endpoint),
    searchArticle: fromApi(searchArticle.endpoint),
    updateArticle: fromApi(updateArticle.endpoint),
    uploadArticle: fromApi(uploadArticle.endpoint),
    uploadPDF: fromApi(uploadPDF.endpoint),
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
    userGetArticleInfo: fromApi(userGetArticleInfo.endpoint),
    dashboardGetProfile: fromApi(dashboardGetProfile.endpoint),
  },
  register: {
    register: fromApi(register.endpoint),
    validateEmail: fromApi(validateEmail.endpoint),
  },
};
