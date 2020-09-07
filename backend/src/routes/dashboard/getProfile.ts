import { FastifyInstance } from "fastify";

import * as api from "yaarxiv-api/dashboard/getProfile";
import { route } from "@/utils/route";

export async function getProfileRoute(fastify: FastifyInstance) {
  route<api.DashboardGetProfileSchema>(fastify, api.endpoint, "DashboardGetProfileSchema", {
    authOption: true,
    summary: api.summary,
  })(
    async (req, rep) => {
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
}
