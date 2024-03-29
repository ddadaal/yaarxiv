import { registerApisMock } from "src/apis/mock/register.mock";
import { setupApisMock } from "src/apis/mock/setup.mock";
import { adminApisMock } from "./admin.mock";
import { articleApisMock } from "./article.mock";
import { authApisMock } from "./auth.mock";
import { dashboardApisMock } from "./dashboard.mock";

export const mockApi = {
  admin: adminApisMock,
  article: articleApisMock,
  auth: authApisMock,
  dashboard: dashboardApisMock,
  register: registerApisMock,
  setup: setupApisMock,
};
