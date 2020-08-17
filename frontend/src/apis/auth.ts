/* eslint-disable max-len */
import { fromApiDefinition } from "./fetch";
import { apiService, mockApiService } from ".";
import * as LoginApi from "yaarxiv-api/auth/login";
import * as RegisterApi from "yaarxiv-api/auth/register";

export const authApis = apiService(() => ({
  login: fromApiDefinition<LoginApi.Schema>(LoginApi.api),
  register: fromApiDefinition<RegisterApi.Schema>(RegisterApi.api),
}));

export const authApisMock = mockApiService<typeof authApis>(() => ({
  login: async ({ id, password }) => {
    if (id === password) {
      return [{ token: id, name: "cjd" }, 200];
    } else {
      return [{}, 403];
    }
  },
  register: async ({ email, password }) => {
    if (email === "c") {
      return [{} ,405];
    } else {
      return [{ token: email }, 201];
    }
  },

}));


