import { searchArticleRoute } from "./article/search";
import { getArticleRoute } from "./article/get";
import { registerUserRoute } from "./register/register";
import { loginRoute } from "./auth/login";
import { deleteArticleRoute } from "./article/delete";
import { dashboardGetArticlesRoute } from "./dashboard/getArticles";
import { adminGetArticlesRoute } from "./admin/getArticles";
import { uploadArticleRoute } from "./article/upload";
import { updateArticleRoute } from "./article/update";
import { uploadScriptRoute } from "./article/uploadScript";
import { changePasswordRoute } from "./dashboard/changePassword";
import { changeAccountInfoRoute } from "./dashboard/changeAccountInfo";
import { getAccountInfoRoute } from "./dashboard/getAccountInfo";
import { requestPasswordResetRoute } from "./auth/requestPasswordReset";
import { validatePasswordResetTokenRoute } from "./auth/validatePasswordResetToken";
import { resetPasswordRoute } from "./auth/resetPassword";
import { adminGetUsersRoute } from "./admin/getUsers";
import { adminDeleteUserRoute } from "./admin/deleteUser";
import { changeArticleAdminSetPublicityRoute } from "./admin/changeArticlePublicity";
import { changeArticleOwnerSetPublicityRoute } from "./dashboard/changeArticlePublicity";
import { getArticleScriptRoute } from "./article/getScript";
import { validateEmailRoute } from "@/routes/register/validateEmail";
import { changeProfileRoute } from "@/routes/dashboard/changeProfile";
import { getProfileRoute } from "@/routes/dashboard/getProfile";
import { retractArticleRoute } from "@/routes/article/retract";
import { queryIfSetupRoute } from "@/routes/setup/queryIfSetup";
import { setupRoute } from "@/routes/setup/setup";
import { getArticleScriptDownloadTokenRoute } from "@/routes/article/getScriptDownloadToken";

export const routes = [
  loginRoute,
  registerUserRoute,
  validateEmailRoute,
  requestPasswordResetRoute,
  validatePasswordResetTokenRoute,
  resetPasswordRoute,
  searchArticleRoute,
  getArticleRoute,
  getArticleScriptRoute,
  deleteArticleRoute,
  dashboardGetArticlesRoute,
  adminGetArticlesRoute,
  adminGetUsersRoute,
  adminDeleteUserRoute,
  uploadArticleRoute,
  updateArticleRoute,
  uploadScriptRoute,
  changePasswordRoute,
  changeAccountInfoRoute,
  getAccountInfoRoute,
  changeArticleAdminSetPublicityRoute,
  changeArticleOwnerSetPublicityRoute,
  changeProfileRoute,
  getProfileRoute,
  retractArticleRoute,
  queryIfSetupRoute,
  setupRoute,
  getArticleScriptDownloadTokenRoute,
];

