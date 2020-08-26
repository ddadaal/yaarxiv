import { FastifyInstance } from "fastify";
import * as loginApi from "yaarxiv-api/auth/login";
import * as registerApi from "yaarxiv-api/auth/register";
import { route } from "@/utils/route";
import { User } from "@/entities/User";

function signUser(fastify: FastifyInstance, user: User) {
  return fastify.jwt.sign({ id: user.id });
}

export async function authRoutes(fastify: FastifyInstance) {
  route<loginApi.LoginSchema>(fastify, loginApi.endpoint, "LoginSchema", { summary: loginApi.summary })(
    async (req, reply) => {
      const { id, password } = req.query;
      const userRepo = fastify.orm.getRepository(User);

      const user = await userRepo.findOne({ email: id });
      if (!user || user.password !== password) {
        reply.code(401);
        return {};
      }

      return {
        token: signUser(fastify, user),
        name: user.name,
        role: user.role,
      };

    });

  route<registerApi.RegisterSchema>(fastify, registerApi.endpoint, "RegisterSchema", { summary: registerApi.summary })(
    async (req, reply) => {
      const userRepo = fastify.orm.getRepository(User);

      const user = new User();
      user.email = req.body.email;
      user.name = user.email.split("@")[0];
      user.password = req.body.password;
      user.role = "user";

      try {
        await userRepo.save(user);
        reply.code(201);
        return {
          token: signUser(fastify, user),
          name: user.name,
        };
      } catch (e) {
        // handle unique constraint violation
        fastify.log.error(e);
        reply.code(405);
        return {};
      }
    },
  );
}
