import { Article } from "@/entities/Article";
import { ArticleRevision } from "@/entities/ArticleRevision";
import { UploadedFile } from "@/entities/UploadedFile";
import { route } from "@/core/route";
import * as api from "yaarxiv-api/api/article/update";
import path from "path";
import { getPathForArticleFile } from "@/utils/articleFiles";
import { getCodeLinkInfo } from "yaarxiv-api/api/utils/codeLink";
import { validateArticleInfoI18nConstraints } from "yaarxiv-api/api/article/models";

export const updateArticleRoute = route(
  api, "UpdateArticleSchema",
  async (req, fastify) => {

    const { articleId } = req.params;
    const { pdfToken, ...rest } = req.body;

    if (!validateArticleInfoI18nConstraints(rest)) {
      return { 400: { code: "ARTICLEINFO_I18N_CONSTRAINTS" } } as const;
    }

    let pdf: UploadedFile | null = null;

    if (pdfToken) {
      pdf = await req.em.findOne(UploadedFile, { id: pdfToken });
      if (!pdf) {
        return { 400: { code: "FILE_TOKEN_INVALID" } } as const;
      }
    }

    if (req.body.codeLink) {
      if (!getCodeLinkInfo(req.body.codeLink)) {
        return { 400: { code: "ARTICLEINFO_I18N_CONSTRAINTS" } } as const;
      }
    }

    const articleRepo = req.em.getRepository(Article);

    const article = await articleRepo.findOne({
      id: articleId,
    }, {
      populate: ["latestRevision.script"],
    });

    if (!article) {
      return { 404: { code: "ARTICLE_NOT_FOUND" } } as const;
    }

    if (article.retractTime) {
      return { 403: { code: "ARTICLE_RETRACTED" } } as const;
    }

    if (article.owner.id !== req.userId()) {
      return { 403: { code: "NOT_AUTHOR" } } as const;
    }

    const time = new Date();

    const latestRev = article.latestRevision.getEntity();

    latestRev.latestRevisionOf = undefined;
    await req.em.flush();

    const revNumber = latestRev.revisionNumber + 1;


    const rev = new ArticleRevision({
      article,
      category: "",
      script: pdf ?? latestRev.script,
      revisionNumber: revNumber,
      time: time,
      ...rest,
    });

    req.em.persist(rev);

    rev.latestRevisionOf = rev.article;
    article.lastUpdateTime = time;

    await req.em.flush();

    // move the uploaded file if file is updated
    // move the file to /{user.id}/{article.id}/
    if (pdf && pdf.id !== latestRev.script.id) {
      const filename = path.basename(pdf.filePath);

      const newPath = getPathForArticleFile(article, filename);

      await fastify.storage.moveFile(pdf.filePath, newPath);

      pdf.filePath = newPath;

      await req.em.flush();
    }

    return { 201: { revisionNumber: revNumber } };

  });
