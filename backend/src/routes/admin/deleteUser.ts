import * as api from "yaarxiv-api/admin/deleteUser";
import { FastifyInstance } from "fastify/types/instance";
import { route } from "@/utils/route";
import { User } from "@/entities/User";

export async function adminDeleteUserRoute(fastify: FastifyInstance) {
  route<api.AdminDeleteArticleSchema>(fastify, api.endpoint, "AdminDeleteArticleSchema", {
    authOption: ["admin"],
    summary: api.summary,
  })(
    async (req) => {

      const { userId } = req.params;

      const repo = fastify.orm.getRepository(User);

      const r = await repo.delete(userId);

      if (!r.affected) {
        return { 404: {} };
      } else {
        return { 200 :{} };
      }
    });

}
