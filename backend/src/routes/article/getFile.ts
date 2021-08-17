import * as api from "yaarxiv-api/api/article/getFile";
import { route, SendFileResponse } from "@/core/route";
import { Article } from "@/entities/Article";
import { extname } from "path";

export const getArticleFileRoute = route(
  api, "GetArticleFileSchema",
  async (req, _, resp) => {
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
    const path = (await targetRevision.script.load()).filePath;

    // set file type header
    resp.header("x-yaarxiv-filetype", extname(path).substr(1));

    return { 200: new SendFileResponse(path) };
  });
