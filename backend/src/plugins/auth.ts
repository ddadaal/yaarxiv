import fp from "fastify-plugin";
import FastifyJwt from "fastify-jwt";
import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { User } from "@/entities/User";
import createError from "http-errors";
import { config } from "@/utils/config";
import { UserRole } from "yaarxiv-api/auth/login";
import { IdentifiedReference } from "@mikro-orm/core";

declare module "fastify" {
  // @ts-ignore
  interface FastifyInstance {
    jwtAuth: (opts: AuthOption) => (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }

  interface FastifyRequest {
    userId(): number;
    dbUser(): Promise<User>;
    dbUserRef(): IdentifiedReference<User>;
  }
}

export type AuthOption = false | UserRole[];

export interface JwtTokenPayload {
  id: number;
}

// define options
// define plugin
export const jwtAuthPlugin = fp(async (fastify) => {

  fastify.register(FastifyJwt, { secret: config.jwtSecret });

  fastify.decorate("jwtAuth", (opts: AuthOption) => async (req: FastifyRequest, reply: FastifyReply) => {
    if (!opts) { return; }
    try {
      await req.jwtVerify<JwtTokenPayload>();

      const user = await req.dbUser();

      if (!opts.includes(user.role)) {
        throw createError(403, "Role doesn't match requirements.");
      }

    } catch (err) {
      reply.send(err);
    }
  });

  fastify.decorateRequest("userId", function () {
    const id = (this.user as JwtTokenPayload).id;
    if (isNaN(id)) {
      throw createError(403, "User ID specified by token is not valid.");
    }
    return id;
  });


  fastify.decorateRequest("dbUserRef", function () {
    const self = this as FastifyRequest;
    return self.em.getRepository(User).getReference(self.userId(), true);
  });

  fastify.decorateRequest("dbUser", async function () {
    const self = this as FastifyRequest;
    const userRef = self.dbUserRef();
    // TODO handle user not found
    const user = await userRef.load();
    return user;
  });
});

export function signUser(fastify: FastifyInstance, { id }: JwtTokenPayload) {
  return fastify.jwt.sign({ id });
}

