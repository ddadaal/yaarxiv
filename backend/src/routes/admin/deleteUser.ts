import * as api from "yaarxiv-api/api/admin/deleteUser";
import { route } from "@/utils/route";
import { User } from "@/entities/User";

export const adminDeleteUserRoute = route(
  api, "AdminDeleteUserSchema",
  async (req) => {

    const { userId } = req.params;

    const repo = req.em.getRepository(User);

    const user = await repo.findOne({ id: userId });

    if (!user) {
      return { 404: null };
    }

    await repo.removeAndFlush(user);

    return { 204 : null };
  });
