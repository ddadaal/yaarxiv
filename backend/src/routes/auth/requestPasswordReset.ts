import { FastifyInstance } from "fastify";
import { route } from "@/utils/route";
import * as api from "yaarxiv-api/auth/requestPasswordReset";
import { User } from "@/entities/User";
import { ResetPasswordToken } from "@/entities/ResetPasswordToken";
import { genId } from "@/utils/genId";
import { config } from "@/utils/config";

export async function requestPasswordResetRoute(fastify: FastifyInstance) {

  route<api.RequestPasswordResetSchema>(fastify, api.endpoint, "RequestPasswordResetSchema", {})(
    async (req) => {
      const { email } = req.body;

      const userRepo = req.em.getRepository(User);

      if (!await userRepo.findOne({ email })) {
        return { 404: { } };
      }

      // generate ResetPasswordToken
      const token = new ResetPasswordToken();
      token.id = genId();
      token.time = new Date();
      token.userEmail = email;
      await req.em.persistAndFlush(token);

      // parse the template
      const template = config.resetPassword.resetPageUrlTemplate;
      const url = template.replace("{}", token.id);

      // send the email with token.
      // most email service requires from to be the same as the login user.
      await fastify.mail.sendMail({
        from: `Yaarxiv Password Reset <${config.mail.auth?.user}>`,
        to: email,
        subject: "Yaarxiv Password Reset",
        text: `
          Click the following link to reset your password.
          This link will be invalid after ${config.resetPassword.tokenValidTimeSeconds / 60} minutes.

          ${url}
        `,
      });

      return { 201: { } };

    },
  );
}
