/* eslint-disable max-len */
import { fromApi } from "./fetch";
import * as LoginApi from "yaarxiv-api/auth/login";
import * as RegisterApi from "yaarxiv-api/auth/register";

export const authApis = () => ({
  login: fromApi<LoginApi.LoginSchema>(LoginApi.endpoint),
  register: fromApi<RegisterApi.RegisterSchema>(RegisterApi.endpoint),
});
