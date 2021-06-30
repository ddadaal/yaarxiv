import * as api from "yaarxiv-api/auth/login";
import { route } from "@/utils/route";
import { User } from "@/entities/User";
import { signUser } from "@/plugins/auth";

export const loginRoute = route(
  api, "LoginSchema",
  async (req, fastify) => {
    const { id, password } = req.query;

    const user = await req.em.findOne(User, { email: id });

    if (!user || !await user.passwordMatch(password)) {
      return { 401: undefined };
    }

    return {
      200: {
        token: signUser(fastify, user),
        name: user.name,
        role: user.role,
        userId: user.id,
      },
    };

  });

