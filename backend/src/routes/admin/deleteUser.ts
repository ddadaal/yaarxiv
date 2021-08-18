import * as api from "yaarxiv-api/api/admin/deleteUser";
import { route } from "@/core/route";
import { User } from "@/entities/User";

export const adminDeleteUserRoute = route(
  api, "AdminDeleteUserSchema",
  async (req) => {

    const { userId } = req.params;

    const user = await req.em.findOne(User, { id: userId });

    if (!user) {
      return { "404": { code: "USER_NOT_FOUND" } } as const;
    }

    await req.em.removeAndFlush(user);

    return { 204: null };
  });
