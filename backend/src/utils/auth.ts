import fp from "fastify-plugin";
import FastifyJwt from "fastify-jwt";
import { FastifyPlugin, FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { User } from "@/entities/User";

declare module "fastify" {
  // @ts-ignore
  interface FastifyInstance {
    jwtAuth(): Promise<void>;
  }

  interface FastifyRequest {
    userId(): string;
    dbUser(): Promise<User>;
  }
}

// define options
export interface AuthPluginOptions {
  secret: string;
}

// define plugin
const jwtAuth: FastifyPlugin<AuthPluginOptions> = async (fastify: FastifyInstance, { secret }) => {
  fastify.register(FastifyJwt, { secret });

  fastify.decorate("jwtAuth", async function (req: FastifyRequest, reply: FastifyReply) {
    try {
      await req.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  fastify.decorateRequest("userId", function () {
    return (this.user as any).id;
  });

  fastify.decorateRequest("dbUser", async function () {
    return await fastify.orm.getRepository(User).findOne(this.userId());
  });
};

export function signUser(fastify: FastifyInstance, user: User) {
  return fastify.jwt.sign({ id: user.id });
}


export default fp(jwtAuth);
