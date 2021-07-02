import * as api from "yaarxiv-api/api/dashboard/getProfile";
import { route } from "@/utils/route";

export const getProfileRoute = route(
  api, "DashboardGetProfileSchema",
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
