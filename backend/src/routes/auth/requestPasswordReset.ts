import { route } from "@/core/route";
import * as api from "yaarxiv-api/api/auth/requestPasswordReset";
import { User } from "@/entities/User";
import { ResetPasswordToken } from "@/entities/ResetPasswordToken";
import { genToken } from "@/utils/genId";
import { Reference } from "@mikro-orm/core";
import { sendResetPassword } from "@/emails/resetPassword";

export const requestPasswordResetRoute = route(
  api, "RequestPasswordResetSchema",

  async (req, fastify) => {
    const { email } = req.body;

    const userRepo = req.em.getRepository(User);

    const user = await userRepo.findOne({ email });

    if (!user) {
      return { 404: { code: "USER_NOT_FOUND" } } as const;
    }

    // generate ResetPasswordToken
    const token = new ResetPasswordToken({
      token: genToken(),
      time: new Date(),
      user: Reference.create(user),
    });

    await req.em.persistAndFlush(token);

    // parse the template

    sendResetPassword(fastify, email, token.token);

    return { 204: null };

  },
);
