import { FastifyInstance } from "fastify";

import * as api from "yaarxiv-api/dashboard/changeProfile";
import { route } from "@/utils/route";
import { User } from "@/entities/User";

export async function changeProfileRoute(fastify: FastifyInstance) {
  route<api.ChangeProfileSchema>(fastify, api.endpoint, "ChangeProfileSchema", {
    authOption: true,
    summary: api.summary,
  })(
    async (req, rep) => {
      const user = await req.dbUser();

      const { email, name } = req.body;

      user.name = name ?? user.name;
      user.email = email ?? user.email;

      await fastify.orm.getRepository(User).save(user);

      return { 200: {} };
    },
  );
}
