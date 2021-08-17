import { route } from "@/core/route";
import * as api from "yaarxiv-api/api/auth/requestPasswordReset";
import { User } from "@/entities/User";
import { ResetPasswordToken } from "@/entities/ResetPasswordToken";
import { genId } from "@/utils/genId";
import { Reference } from "@mikro-orm/core";
import { sendResetPassword } from "@/emails/resetPassword";

export const requestPasswordResetRoute = route(
  api, "RequestPasswordResetSchema",

  async (req, fastify) => {
    const { email } = req.body;

    const userRepo = req.em.getRepository(User);

    const user = await userRepo.findOne({ email });

    if (!user) {
      return { 404: null };
    }

    // generate ResetPasswordToken
    const token = new ResetPasswordToken({
      id: genId(),
      time: new Date(),
      user: Reference.create(user),
    });

    await req.em.persistAndFlush(token);

    // parse the template

    sendResetPassword(fastify, email, token.id);

    return { 201: null };

  },
);
