import { searchArticleRoute } from "./article/search";
import { getArticleRoute } from "./article/get";
import { registerRoute } from "./auth/register";
import { loginRoute } from "./auth/login";
import { deleteArticleRoute } from "./article/delete";
import { dashboardGetArticlesRoute } from "./dashboard/getArticles";
import { adminGetArticlesRoute } from "./admin/getArticles";

export const routes = [
  loginRoute,
  registerRoute,
  searchArticleRoute,
  getArticleRoute,
  deleteArticleRoute,
  dashboardGetArticlesRoute,
  adminGetArticlesRoute,
];

