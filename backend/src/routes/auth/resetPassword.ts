
import { FastifyInstance } from "fastify";
import { route } from "@/utils/route";
import * as api from "yaarxiv-api/auth/resetPassword";
import { User } from "@/entities/User";
import { ResetPasswordToken } from "@/entities/ResetPasswordToken";

export async function resetPasswordRoute(fastify: FastifyInstance) {

  route<api.ResetPasswordSchema>(fastify, api.endpoint, "ResetPasswordSchema", {})(
    async (req) => {
      const { token, newPassword } = req.body;

      return await fastify.orm.transaction(async (em) => {


        const tokenRepo = em.getRepository(ResetPasswordToken);

        const tokenEntity = await tokenRepo.findOne(token);

        // delete the entity
        if (tokenEntity) {
          await tokenRepo.remove(tokenEntity);
        }

        if (tokenEntity === undefined || tokenEntity.timeout) {
          return { 403 : {} };
        }

        const userRepo = em.getRepository(User);

        const user = await userRepo.findOne({ email: tokenEntity.userEmail });

        if (!user) {
          return { 403: {} };
        }

        await user.setPassword(newPassword);
        await userRepo.save(user);
        return { 201: { } };
      });


    },
  );
}
