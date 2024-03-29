import { UserRole } from "yaarxiv-api/api/auth/login";
import { realApi } from "../api";
import { makeHttpError } from "../fetch";

export const authApisMock: typeof realApi["auth"] = ({
  login: async ({ query: { id, password } }) => {
    if (password === "admin") {
      return { token: "admin" ,name: "admin1", role: UserRole.Admin, userId: 2 };
    }
    if (password === "1") {
      return { token: id, name: "cjd", role: UserRole.User, userId: 1 };
    } else {
      throw makeHttpError(401, {});
    }
  },
  requestPasswordReset: async () => {
    return null;
  },
  validatePasswordResetToken: async ({ query: { token } }) => ({ valid: !!token }),
  resetPassword: async () => null,
});

