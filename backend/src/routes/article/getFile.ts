import * as api from "yaarxiv-api/api/article/getFile";
import { route } from "@/core/route";
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
      return { "404": { code: "ARTICLE_NOT_FOUND" } } as const;
    }

    if (article.retractTime) {
      return { "403": { code: "ARTICLE_RETRACTED" } } as const;
    }

    const targetRevision = revision
      ? article.revisions.getItems().find((r) => r.revisionNumber === revision)
      : article.latestRevision.getEntity();

    if (!targetRevision) {
      return { "404": { code: "REVISION_NOT_FOUND" } } as const;
    }

    // load pdf link
    const path = (await targetRevision.script.load()).filePath;

    // set file type header
    await resp.header("x-yaarxiv-filetype", extname(path).substr(1))
      .serveFile(path);

    return { 200: undefined };
  });
