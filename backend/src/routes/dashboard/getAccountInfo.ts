import * as api from "yaarxiv-api/api/dashboard/getAccountInfo";
import { route } from "@/utils/route";

export const getAccountInfoRoute = route(
  api, "GetAccountInfoSchema",
  async (req) => {
    const user = await req.dbUser();

    return {
      200: {
        email: user.email,
        name: user.name,
        userId: user.id,
      },
    };

  },
);
