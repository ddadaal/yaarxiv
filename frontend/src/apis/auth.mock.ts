import { MockApi } from ".";
import { authApis } from "./auth";

export const authApisMock: MockApi<typeof authApis> = (({ makeHttpError }) => ({
  login: async ({ query: { id, password } }) => {
    if (id === password) {
      return { token: id, name: "cjd" };
    } else {
      throw makeHttpError({}, 403);
    }
  },
  register: async ({ body: { email, password } }) => {
    if (email === "c") {
      throw makeHttpError({}, 405);
    } else {
      return { token: email, name: email.split("@")[0] };
    }
  },

}));

