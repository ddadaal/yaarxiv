import { route } from "@/utils/route";
import * as api from "yaarxiv-api/auth/register";
import { User, UserRole } from "@/entities/User";
import { signUser } from "@/plugins/auth";
import { UniqueConstraintViolationException } from "@mikro-orm/core";

export const registerRoute = route(
  api, "RegisterSchema",
  async (req, fastify) => {
    const user = new User();
    user.email = req.body.email;
    user.name = user.email.split("@")[0];
    user.role = UserRole.User;

    await user.setPassword(req.body.password);

    try {
      await req.em.persistAndFlush(user);
      return {
        201: {
          token: signUser(fastify, user),
          name: user.name,
          userId: user.id,
        },
      };
    } catch (e) {
      if (e instanceof UniqueConstraintViolationException) {
        if (e.message.startsWith("insert into `user`")) {
          return { 405: undefined };
        }
      }
      throw e;
    }
  },
);
