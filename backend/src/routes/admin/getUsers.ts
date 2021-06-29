import * as api from "yaarxiv-api/admin/getUsers";
import { route } from "@/utils/route";
import { User } from "@/entities/User";
import { paginationProps } from "@/utils/pagination";

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
