import { route } from "@/utils/route";
import * as api from "yaarxiv-api/api/auth/requestPasswordReset";
import { User } from "@/entities/User";
import { ResetPasswordToken } from "@/entities/ResetPasswordToken";
import { genId } from "@/utils/genId";
import { config } from "@/utils/config";
import { Reference } from "@mikro-orm/core";

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
    const template = config.resetPassword.resetPagePathnameTemplate;
    const url = template.replace("{}", token.id);

    // send the email with token.
    // most email service requires from to be the same as the login user.
    await fastify.sendMail({
      to: email,
      subject: "Yaarxiv Password Reset",
      text: `
          Click the following link to reset your password.
          This link will be invalid after ${config.resetPassword.tokenValidTimeSeconds / 60} minutes.

          ${url}
        `,
    });

    return { 201: null };

  },
);
