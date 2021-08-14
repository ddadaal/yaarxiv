import fp from "fastify-plugin";
import FastifyJwt from "fastify-jwt";
import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { User } from "@/entities/User";
import createError from "fastify-error";
import { config } from "@/core/config";
import { UserRole } from "yaarxiv-api/api/auth/login";
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
    tryGetUser(): Promise<User | undefined>;
  }
}

export const AuthErrors = {
  TokenError: createError("YAARXIV_TOKEN_INVALID", "The token provided is not valid.", 401),
  RoleError: createError("YAARXIV_BAD_ROLE", "Logged-in user does not have required role.", 403),
  UserNotExistError: createError("YAARXIV_USER_NOT_EXIST", "Specified User not exist.", 401),
};

export type AuthOption = false | UserRole[];

export interface JwtTokenPayload {
  id: number;
  role: UserRole;
}

// define options
// define plugin
export const jwtAuthPlugin = fp(async (fastify) => {

  fastify.register(FastifyJwt, { secret: config.jwtSecret });

  fastify.decorate("jwtAuth", (opts: AuthOption) => async (req: FastifyRequest, reply: FastifyReply) => {
    if (!opts) { return; }
    try {
      const user = await req.jwtVerify<JwtTokenPayload>();

      if (!opts.includes(user.role)) {
        throw new AuthErrors.RoleError();
      }

    } catch (err) {
      reply.send(err);
    }
  });

  fastify.decorateRequest("tryGetUser", async function () {

    const self = this as FastifyRequest;

    try {
      await self.jwtVerify();
    } catch (err) {
      return undefined;
    }

    const id = +(self.user as JwtTokenPayload).id;
    if (isNaN(id)) {
      return undefined;
    }

    const user = await self.em.findOne(User, { id });
    return user;
  });


  fastify.decorateRequest("userId", function () {
    const id = (this.user as JwtTokenPayload).id;
    if (typeof id !== "number") {
      throw new AuthErrors.TokenError();
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

export function signUser(fastify: FastifyInstance, { id, role }: JwtTokenPayload) {
  return fastify.jwt.sign({ id, role });
}

