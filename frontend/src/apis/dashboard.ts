/* eslint-disable max-len */
import * as getArticles from "yaarxiv-api/dashboard/getArticles";
import { fromApi } from "./fetch";

export const dashboardApis = () => ({ getArticles: fromApi<getArticles.UserGetArticleInfoSchema>(getArticles.endpoint) });
