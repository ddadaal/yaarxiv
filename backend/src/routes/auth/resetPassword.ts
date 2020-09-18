
import { FastifyInstance } from "fastify";
import { route } from "@/utils/route";
import * as api from "yaarxiv-api/auth/resetPassword";
import { User } from "@/entities/User";
import { ResetPasswordToken } from "@/entities/ResetPasswordToken";

export async function resetPasswordRoute(fastify: FastifyInstance) {
  route<api.ResetPasswordSchema>(fastify, api.endpoint, "ResetPasswordSchema", {})(
    async (req) => {
      const { token, newPassword } = req.body;

      const tokenRepo = req.em.getRepository(ResetPasswordToken);

      const tokenEntity = await tokenRepo.findOne(token);

      // delete the entity
      if (tokenEntity) {
        await tokenRepo.removeAndFlush(tokenEntity);
      } else {
        return { 403: { reason: "token-not-exists" } };
      }

      if (tokenEntity.timeout) {
        return { 403 : { reason: "token-timeout" } };
      }

      const userRepo = req.em.getRepository(User);

      const user = await userRepo.findOne({ email: tokenEntity.userEmail });

      if (!user) {
        return { 403: { reason: "user-not-exists" } };
      }

      await user.setPassword(newPassword);
      userRepo.persist(user);

      await req.em.flush();

      return { 201: { } };
    });
}
