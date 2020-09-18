import { FastifyInstance } from "fastify";
import { route } from "@/utils/route";
import * as registerApi from "yaarxiv-api/auth/register";
import { User } from "@/entities/User";
import { genId } from "@/utils/genId";
import { signUser } from "@/plugins/auth";

export async function registerRoute(fastify: FastifyInstance) {

  route<registerApi.RegisterSchema>(fastify, registerApi.endpoint, "RegisterSchema", { summary: registerApi.summary })(
    async (req) => {
      const userRepo = req.em.getRepository(User);

      const user = new User();
      user.id = genId();
      user.email = req.body.email;
      user.name = user.email.split("@")[0];
      user.role = "user";
      await user.setPassword(req.body.password);

      try {
        await userRepo.persistAndFlush(user);
        return {
          201: {
            token: signUser(fastify, user),
            name: user.name,
            userId: user.id,
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
