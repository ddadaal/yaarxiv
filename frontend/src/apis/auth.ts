/* eslint-disable max-len */
import { fromApiDefinition } from "./fetch";
import * as LoginApi from "yaarxiv-api/auth/login";
import * as RegisterApi from "yaarxiv-api/auth/register";
import type { Api, MockApi } from ".";

export const authApis = () => ({
  login: fromApiDefinition<LoginApi.Schema>(LoginApi.api),
  register: fromApiDefinition<RegisterApi.Schema>(RegisterApi.api),
});

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


