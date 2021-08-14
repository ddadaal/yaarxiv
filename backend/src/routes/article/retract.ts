import { route } from "@/utils/route";
import * as api from "yaarxiv-api/api/article/retract";
import { Article } from "@/entities/Article";
import { UserRole } from "@/entities/User";

export const retractArticleRoute = route(
  api, "RetractArticleSchema",
  async (req) => {
    const { articleId } = req.params;

    const user = await req.dbUser();

    const article = await req.em.findOne(Article, { id: articleId }, {
      populate: ["revisions.script"],
    });

    if (!article) {
      return { 404: null };
    }

    if (article.retractTime) {
      return { 403: { reason: "retracted" as const } };
    }

    if (article.owner.id !== user.id && user.role !== UserRole.Admin) {
      return { 403: { reason: "noAccess" as const } };
    }

    article.retract(user, new Date());

    await req.em.flush();

    return { 204: null };
  },
);
