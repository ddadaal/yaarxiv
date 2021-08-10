import * as api from "yaarxiv-api/api/article/getFile";
import { route, SendFileResponse } from "@/utils/route";
import { Article } from "@/entities/Article";

export const getArticleFileRoute = route(
  api, "GetArticleFileSchema",
  async (req) => {
    const { articleId } = req.params;
    const { revision } = req.query;

    const article = await req.em.findOne(Article, { id: articleId }, {
      populate: ["revisions", "latestRevision"],
    });

    if (!article || !article.checkAccessibility(await req.tryGetUser())) {
      return { 404: { notFound: "article" } as const };
    }

    if (article.retractTime) {
      return { 403: null };
    }

    const targetRevision = revision
      ? article.revisions.getItems().find((r) => r.revisionNumber === revision)
      : article.latestRevision.getEntity();

    if (!targetRevision) {
      return { 404: { notFound: "revision" } as const };
    }

    // load pdf link
    const path = (await targetRevision.pdf.load()).filePath;

    return { 200: new SendFileResponse(path) };
  });
