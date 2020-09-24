import { searchArticleRoute } from "./article/search";
import { getArticleRoute } from "./article/get";
import { registerRoute } from "./auth/register";
import { loginRoute } from "./auth/login";
import { deleteArticleRoute } from "./article/delete";
import { dashboardGetArticlesRoute } from "./dashboard/getArticles";
import { adminGetArticlesRoute } from "./admin/getArticles";
import { uploadArticleRoute } from "./article/upload";
import { updateArticleRoute } from "./article/update";
import { uploadPdfRoute } from "./article/uploadPdf";
import { changePasswordRoute } from "./dashboard/changePassword";
import { changeProfileRoute } from "./dashboard/changeProfile";
import { getProfileRoute } from "./dashboard/getProfile";
import { requestPasswordResetRoute } from "./auth/requestPasswordReset";
import { validatePasswordResetTokenRoute } from "./auth/validatePasswordResetToken";
import { resetPasswordRoute } from "./auth/resetPassword";
import { adminGetUsersRoute } from "./admin/getUsers";
import { adminDeleteUserRoute } from "./admin/deleteUser";
import { changeArticleAdminSetPublicityRoute } from "./admin/changeArticlePublicity";
import { changeArticleOwnerSetPublicityRoute } from "./dashboard/changeArticlePublicity";

export const routes = [
  loginRoute,
  registerRoute,
  requestPasswordResetRoute,
  validatePasswordResetTokenRoute,
  resetPasswordRoute,
  searchArticleRoute,
  getArticleRoute,
  deleteArticleRoute,
  dashboardGetArticlesRoute,
  adminGetArticlesRoute,
  adminGetUsersRoute,
  adminDeleteUserRoute,
  uploadArticleRoute,
  updateArticleRoute,
  uploadPdfRoute,
  changePasswordRoute,
  changeProfileRoute,
  getProfileRoute,
  changeArticleAdminSetPublicityRoute,
  changeArticleOwnerSetPublicityRoute,
];

