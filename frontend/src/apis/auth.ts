/* eslint-disable max-len */
import { fromApiDefinition } from "./fetch";
import * as LoginApi from "yaarxiv-api/auth/login";
import * as RegisterApi from "yaarxiv-api/auth/register";

export const authApis = () => ({
  login: fromApiDefinition<LoginApi.LoginSchema>(LoginApi.endpoint),
  register: fromApiDefinition<RegisterApi.RegisterSchema>(RegisterApi.endpoint),
});
