import * as api from "yaarxiv-api/dashboard/changePassword";
import { route } from "@/utils/route";

export const changePasswordRoute = route(
  api, "ChangePasswordSchema",
  async (req) => {
    const user = await req.dbUser();

    const { changed, current } = req.body;

    if (!await user.passwordMatch(current)) {
      return { 403: undefined };
    }

    await user.setPassword(changed);

    await req.em.flush();

    return { 204: undefined };
  },
);
