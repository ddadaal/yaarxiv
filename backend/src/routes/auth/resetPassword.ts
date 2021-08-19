import { route } from "@/core/route";
import * as api from "yaarxiv-api/api/auth/resetPassword";
import { ResetPasswordToken } from "@/entities/ResetPasswordToken";

export const resetPasswordRoute = route(
  api, "ResetPasswordSchema",
  async (req) => {
    const { token, newPassword } = req.body;

    const tokenEntity = await req.em.findOne(ResetPasswordToken, { token });

    // delete the entity
    if (tokenEntity) {
      req.em.remove(tokenEntity);
    }

    if (tokenEntity === null || tokenEntity.isTimeout) {
      await req.em.flush();
      return { "403": { code: "TOKEN_NOT_VALID" } } as const;
    }

    const user = await tokenEntity.user.load();


    if (!user) {
      await req.em.flush();
      return { "403": { code: "TOKEN_NOT_VALID" } } as const;
    }

    await user.setPassword(newPassword);

    await req.em.flush();
    return { 201: null };
  });


