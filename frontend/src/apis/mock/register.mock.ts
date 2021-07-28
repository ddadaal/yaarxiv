import { realApi } from "../api";
import { makeHttpError } from "../fetch";

export const registerApisMock: typeof realApi["register"] = ({
  register: async ({ body: { email } }) => {
    if (email === "c@c.com") {
      throw makeHttpError(405, {});
    } else {
      return { token: email, name: email.split("@")[0], userId: 123 };
    }
  },
  validateEmail: async ({ body: { token } }) => {
    if (!token) {
      throw makeHttpError(403, {});
    }
    return {};
  },
});

