import { FastifyInstance } from "fastify";
import { route } from "@/utils/route";
import * as registerApi from "yaarxiv-api/auth/register";
import { User } from "@/entities/User";
import { genId } from "@/utils/genId";
import { signUser } from "@/utils/auth";

export async function registerRoute(fastify: FastifyInstance) {

  route<registerApi.RegisterSchema>(fastify, registerApi.endpoint, "RegisterSchema", { summary: registerApi.summary })(
    async (req, reply) => {
      const userRepo = req.orm.getRepository(User);

      const user = new User();
      user.id = genId();
      user.email = req.body.email;
      user.name = user.email.split("@")[0];
      user.password = req.body.password;
      user.role = "user";

      try {
        await userRepo.persistAndFlush(user);
        return {
          201: {
            token: signUser(fastify, user),
            name: user.name,
          },
        };
      } catch (e) {
        // handle unique constraint violation
        fastify.log.error(e);
        return { 405: {} };
      }
    },
  );
}
