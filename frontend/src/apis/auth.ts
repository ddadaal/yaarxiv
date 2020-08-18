/* eslint-disable max-len */
import { fromApiDefinition } from "./fetch";
import { apiService, mockApiService } from ".";
import * as LoginApi from "yaarxiv-api/auth/login";
import * as RegisterApi from "yaarxiv-api/auth/register";

export const authApis = apiService(() => ({
  login: fromApiDefinition<LoginApi.Schema>(LoginApi.api),
  register: fromApiDefinition<RegisterApi.Schema>(RegisterApi.api),
}));

export const authApisMock = mockApiService<typeof authApis>(({ makeHttpError }) => ({
  login: async ({ id, password }) => {
    if (id === password) {
      return { token: id, name: "cjd" };
    } else {
      throw makeHttpError({}, 403);
    }
  },
  register: async ({ email, password }) => {
    if (email === "c") {
      throw makeHttpError({}, 405);
    } else {
      return { token: email, name: email.split("@")[0] };
    }
  },

}));


