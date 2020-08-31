import type { MockApi } from ".";
import type { authApis } from "./auth";

export const authApisMock: MockApi<typeof authApis> = (({ makeHttpError }) => ({
  login: async ({ query: { id, password } }) => {
    if (id === "admin") {
      return { token: "admin" ,name: "admin1", role: "admin" };
    }
    if (id === password) {
      return { token: id, name: "cjd", role: "user" };
    } else {
      throw makeHttpError({}, 401);
    }
  },
  register: async ({ body: { email } }) => {
    if (email === "c@c.com") {
      throw makeHttpError({}, 405);
    } else {
      return { token: email, name: email.split("@")[0] };
    }
  },

}));

