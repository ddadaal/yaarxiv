import * as login from "./auth";
import * as article from "./article";

export const routes = [
  login.authRoutes,
  article.articlesRoutes,
];

