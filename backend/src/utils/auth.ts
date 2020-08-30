import fp from "fastify-plugin";
import FastifyJwt from "fastify-jwt";
import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { User, UserRole } from "@/entities/User";
import { makeError } from "./error";
import createError from "http-errors";
import { config } from "node-config-ts";


declare module "fastify" {
  // @ts-ignore
  interface FastifyInstance {
    jwtAuth: (opts: AuthOption) => (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }

  interface FastifyRequest {
    userId(): string;
    dbUser(): Promise<User>;
  }
}

export type AuthOption = undefined | boolean | UserRole[];

export interface JwtTokenPayload {
  id: string;
  role: UserRole;
}

// define options
// define plugin
export const jwtAuthPlugin = fp(async (fastify) => {

  fastify.register(FastifyJwt, { secret: config.jwtSecret });

  fastify.decorate("jwtAuth", (opts: AuthOption) => async (req: FastifyRequest, reply: FastifyReply) => {
    if (!opts) { return; }
    try {
      const { role } = await req.jwtVerify<JwtTokenPayload>();
      if (Array.isArray(opts) && !opts.includes(role)) {
        throw createError(403, "Role doesn't satisfy.");
      }
    } catch (err) {
      reply.send(err);
    }
  });

  fastify.decorateRequest("userId", function () {
    return (this.user as JwtTokenPayload).id;
  });

  fastify.decorateRequest("dbUser", async function () {
    return await fastify.orm.getRepository(User).findOne(this.userId());
  });
});

export function signUser(fastify: FastifyInstance, user: User) {
  return fastify.jwt.sign({ id: user.id, role: user.role });
}

