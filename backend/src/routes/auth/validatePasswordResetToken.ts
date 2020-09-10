import { FastifyInstance } from "fastify";
import { route } from "@/utils/route";
import * as api from "yaarxiv-api/auth/validatePasswordResetToken";
import { ResetPasswordToken } from "@/entities/ResetPasswordToken";

export async function validatePasswordResetTokenRoute(fastify: FastifyInstance) {

  route<api.ValidatePasswordResetTokenSchema>(fastify, api.endpoint, "ValidatePasswordResetTokenSchema", {})(
    async (req) => {
      const { token } = req.query;

      const repo = fastify.orm.getRepository(ResetPasswordToken);

      const entity = await repo.findOne(token);

      return { 200: { valid: entity !== undefined && !entity.timeout } };
    },
  );
}
