import * as api from "yaarxiv-api/dashboard/changeProfile";
import { route } from "@/utils/route";

export const changeProfileRoute = route(
  api, "ChangeProfileSchema",
  async (req) => {
    const user = await req.dbUser();

    const { email, name } = req.body;

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    await req.em.flush();

    return { 204: undefined };
  },
);
