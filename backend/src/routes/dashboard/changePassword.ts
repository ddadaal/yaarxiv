import { FastifyInstance } from "fastify";

import * as api from "yaarxiv-api/dashboard/changePassword";
import { route } from "@/utils/route";
import { User } from "@/entities/User";

export async function changePasswordRoute(fastify: FastifyInstance) {
  route<api.ChangePasswordSchema>(fastify, api.endpoint, "ChangePasswordSchema", {
    authOption: true,
    summary: api.summary,
  })(
    async (req, rep) => {
      const user = await req.dbUser();

      const { changed, current } = req.body;

      if (!await user.passwordMatch(current)) {
        return { 403: {} };
      }

      await user.setPassword(changed);

      await fastify.orm.getRepository(User).save(user);

      return { 200: {} };
    },
  );
}
