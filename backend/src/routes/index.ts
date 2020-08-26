import * as home from "./home";
import * as login from "./auth";
import * as article from "./article";

export const routes = [
  home.homeRoutes,
  login.authRoutes,
  article.articlesRoutes,
];

