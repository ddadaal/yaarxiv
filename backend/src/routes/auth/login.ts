import * as loginApi from "yaarxiv-api/auth/login";
import { FastifyInstance } from "fastify/types/instance";
import { route } from "@/utils/route";
import { User } from "@/entities/User";
import { signUser } from "@/utils/auth";

export async function loginRoute(fastify: FastifyInstance) {
  route<loginApi.LoginSchema>(fastify, loginApi.endpoint, "LoginSchema", { summary: loginApi.summary })(
    async (req, reply) => {
      const { id, password } = req.query;
      const userRepo = fastify.orm.getRepository(User);

      const user = await userRepo.findOne({ email: id });
      if (!user || user.password !== password) {
        return { 401: {} };
      }

      return {
        200: {
          token: signUser(fastify, user),
          name: user.name,
          role: user.role,
        },
      };

    });

}
