/* eslint-disable max-len */
import { fromApi } from "./fetch";
import * as LoginApi from "yaarxiv-api/auth/login";
import * as RegisterApi from "yaarxiv-api/auth/register";
import * as requestPasswordResetApi from "yaarxiv-api/auth/requestPasswordReset";
import * as validateResetPasswordTokenApi from "yaarxiv-api/auth/validatePasswordResetToken";
import * as resetPasswordApi from "yaarxiv-api/auth/resetPassword";

export const authApis = () => ({
  login: fromApi<LoginApi.LoginSchema>(LoginApi.endpoint),
  register: fromApi<RegisterApi.RegisterSchema>(RegisterApi.endpoint),
  requestPasswordReset: fromApi<requestPasswordResetApi.RequestPasswordResetSchema>(requestPasswordResetApi.endpoint),
  validatePasswordResetToken: fromApi<validateResetPasswordTokenApi.ValidatePasswordResetTokenSchema>(validateResetPasswordTokenApi.endpoint),
  resetPassword: fromApi<resetPasswordApi.ResetPasswordSchema>(resetPasswordApi.endpoint),
});


