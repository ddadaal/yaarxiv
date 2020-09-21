import * as api from "yaarxiv-api/admin/getUsers";
import { FastifyInstance } from "fastify/types/instance";
import { route } from "@/utils/route";
import { User } from "@/entities/User";

export async function adminGetUsersRoute(fastify: FastifyInstance) {
  route<api.AdminGetUsersSchema>(fastify, api.endpoint, "AdminGetUsersSchema", {
    authOption: ["admin"],
  })(
    async (req) => {

      const { page, searchWord } = req.query;

      const repo = fastify.orm.getRepository(User);

      const builder = repo.createQueryBuilder("u")
        .leftJoinAndSelect("u.articles", "a");

      if (searchWord) {
        builder
          .andWhere("u.name LIKE :pat", { pat: `%${searchWord}%` })
          .orWhere("u.email LIKE :pat", { pat: `%${searchWord}%` });
      }

      const [articles, count] = await builder
        .skip(((page ?? 1) - 1) * 10)
        .take(10)
        .getManyAndCount();

      return {
        200: {
          users: articles.map((x) => ({
            id: x.id,
            name: x.name,
            email: x.email,
            role: x.role,
            articleCount: x.articles.length,
          })),
          totalCount: count,
        },
      };
    });

}
