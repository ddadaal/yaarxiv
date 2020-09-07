import { FastifyInstance } from "fastify";

import * as api from "yaarxiv-api/dashboard/changePassword";
import { route } from "@/utils/route";
import { User } from "@/entities/User";
import { compare, encrypt } from "@/utils/bcrypt";

export async function changePasswordRoute(fastify: FastifyInstance) {
  route<api.ChangePasswordSchema>(fastify, api.endpoint, "ChangePasswordSchema", {
    authOption: true,
    summary: api.summary,
  })(
    async (req, rep) => {
      const user = await req.dbUser();

      const { changed, current } = req.body;

      if (!await compare(current, user.password)) {
        return { 403: {} };
      }

      user.password = await encrypt(changed);

      await fastify.orm.getRepository(User).save(user);

      return { 200: {} };
    },
  );
}
