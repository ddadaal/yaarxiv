import { deleteArticleRoute } from "./article/delete";
import { getArticleRoute } from "./article/get";
import { loginRoute } from "./auth/login";
import { registerRoute } from "./auth/register";
import { requestPasswordResetRoute } from "./auth/requestPasswordReset";
import { resetPasswordRoute } from "./auth/resetPassword";
import { validatePasswordResetTokenRoute } from "./auth/validatePasswordResetToken";

export const routes = [
  loginRoute,
  registerRoute,
  resetPasswordRoute,
  requestPasswordResetRoute,
  validatePasswordResetTokenRoute,
  getArticleRoute,
  deleteArticleRoute,
];

