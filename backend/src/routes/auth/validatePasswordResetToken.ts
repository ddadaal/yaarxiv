import { route } from "@/utils/route";
import * as api from "yaarxiv-api/api/auth/validatePasswordResetToken";
import { ResetPasswordToken } from "@/entities/ResetPasswordToken";

export const validatePasswordResetTokenRoute = route(
  api, "ValidatePasswordResetTokenSchema",
  async (req) => {
    const { token } = req.query;

    const entity = await req.em.findOne(ResetPasswordToken, { id: token });

    return { 200: { valid: entity !== null && !entity.isTimeout } };
  },
);
