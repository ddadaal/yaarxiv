import { route } from "@/utils/route";
import * as api from "yaarxiv-api/auth/resetPassword";
import { ResetPasswordToken } from "@/entities/ResetPasswordToken";

export const resetPasswordRoute = route(
  api, "ResetPasswordSchema",
  async (req) => {
    const { token, newPassword } = req.body;

    const tokenEntity = await req.em.findOne(ResetPasswordToken, { id: token });

    // delete the entity
    if (tokenEntity) {
      req.em.remove(tokenEntity);
    }

    if (tokenEntity === null || tokenEntity.isTimeout) {
      await req.em.flush();
      return { 403 : null };
    }

    const user = await tokenEntity.user.load();

    await user.setPassword(newPassword);


    if (!user) {
      return { 403: null };
    }

    await user.setPassword(newPassword);

    await req.em.flush();

    return { 201: null };
  });


