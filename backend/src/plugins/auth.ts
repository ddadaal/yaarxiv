import fp from "fastify-plugin";
import FastifyJwt from "fastify-jwt";
import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { User, UserRole } from "@/entities/User";
import createError from "http-errors";
import { config } from "@/utils/config";

declare module "fastify" {
  // @ts-ignore
  interface FastifyInstance {
    jwtAuth: (opts: AuthOption) => (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }

  interface FastifyRequest {
    tryGetToken(): Promise<JwtTokenPayload | undefined>;
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

  fastify.decorateRequest("tryGetToken", async function() {
    return await (this as FastifyRequest).jwtVerify<JwtTokenPayload>()
      .catch(() => undefined);
  });

  fastify.decorateRequest("userId", function () {
    return (this.user as JwtTokenPayload).id;
  });

  fastify.decorateRequest("dbUser", async function () {
    const user = await fastify.orm.getRepository(User).findOne(this.userId());
    if (!user) {
      throw createError(401, "User specified by token doesn't exist.");
    }
    return user;
  });
});

export interface TokenPayload {
  id: string;
  role: UserRole;
}

export function signUser(fastify: FastifyInstance, user: TokenPayload) {
  return fastify.jwt.sign({ id: user.id, role: user.role });
}

