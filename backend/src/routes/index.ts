import { searchArticleRoute } from "./article/search";
import { getArticleRoute } from "./article/get";
import { registerRoute } from "./auth/register";
import { loginRoute } from "./auth/login";

export const routes = [
  loginRoute,
  registerRoute,
  searchArticleRoute,
  getArticleRoute,
];

