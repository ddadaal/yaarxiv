import * as api from "yaarxiv-api/api/admin/getUsers";
import { route } from "@/core/route";
import { User } from "@/entities/User";
import { paginationProps } from "@/utils/orm";

export const adminGetUsersRoute = route(
  api, "AdminGetUsersSchema",
  async (req) => {

    const { page, searchWord } = req.query;

    const [users, count] = await req.em.findAndCount(User,
      searchWord
        ? {
          $or: [
            { name: { $like: `%${searchWord}%` } },
            { email: { $like: `%${searchWord}%` } },
          ],
        } : {},
      {
        populate: ["articles"],
        ...paginationProps(page),
      },
    );

    return {
      200: {
        users: users.map((x) => ({
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
