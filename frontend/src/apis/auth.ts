/* eslint-disable max-len */
import { fromApiDefinition } from "./fetch";
import * as LoginApi from "yaarxiv-api/auth/login";
import * as RegisterApi from "yaarxiv-api/auth/register";

export const authApis = () => ({
  login: fromApiDefinition<LoginApi.Schema>(LoginApi.api),
  register: fromApiDefinition<RegisterApi.Schema>(RegisterApi.api),
});
