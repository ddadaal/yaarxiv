import * as api from "yaarxiv-api/article/get";
import { route } from "@/utils/route";
import { Article } from "@/entities/Article";
import { UserRole } from "@/entities/User";

export const getArticleRoute = route(
  api, "GetArticleSchema",
  async (req) => {
    const { articleId } = req.params;
    const { revision } = req.query;

    const article = await req.em.findOne(Article, { id: articleId }, {
      populate: ["revisions", "latestRevision"],
    });

    if (!article) {
      return { 404: { notFound: "article" } as const };
    }

    // if the logged in user is the owner or an admin,
    // then it can get the article even if the article is not public,
    // else, return 404 as if the article does not exist.
    if (!article.adminSetPublicity || !article.ownerSetPublicity) {
      const user = await req.tryGetUser();
      if (!user || (!(user.role === UserRole.Admin || article.owner.id === user.id))) {
        return { 404: { notFound: "article" } as const };
      }
    }

    const targetRevision = revision
      ? article.revisions.getItems().find((r) => r.revisionNumber === revision)
      : article.latestRevision.getEntity();

    if (!targetRevision) {
      return { 404: { notFound: "revision" } as const };
    }

    return {
      200: {
        article: {
          id: articleId,
          revisionNumber: targetRevision.revisionNumber,
          currentRevision: {
            abstract: targetRevision.abstract,
            authors: targetRevision.authors,
            category: targetRevision.category,
            keywords: targetRevision.keywords,
            pdfLink: targetRevision.pdf.pdfUrl,
            title: targetRevision.title,
            codeLink: targetRevision.codeLink,
          },
          revisions: article.revisions.getItems().map((x) => ({
            time: x.time.toISOString(),
            number: x.revisionNumber,
          })),
          ownerId: article.owner.id,
          createTime: article.createTime.toISOString(),
        },
      },
    };

  },
);
