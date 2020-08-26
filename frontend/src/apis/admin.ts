import * as getArticles from "yaarxiv-api/admin/getArticles";
import { fromApi } from "./fetch";

export const adminApis = () => ({
  getArticles: fromApi<getArticles.AdminGetArticlesSchema>(getArticles.endpoint),
});
