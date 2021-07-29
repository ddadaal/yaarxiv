import * as api from "yaarxiv-api/api/dashboard/changeAccountInfo";
import { route } from "@/utils/route";

export const changeAccountInfoRoute = route(
  api, "ChangeAccountInfoSchema",
  async (req) => {
    const user = await req.dbUser();

    const { name } = req.body;

    user.name = name ?? user.name;

    await req.em.flush();

    return { 204: null };
  },
);
