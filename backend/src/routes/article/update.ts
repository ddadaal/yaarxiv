import { Article } from "@/entities/Article";
import { ArticleRevision } from "@/entities/ArticleRevision";
import { UploadedFile } from "@/entities/UploadedFile";
import { route } from "@/core/route";
import * as api from "yaarxiv-api/api/article/update";
import { validateCodeLink } from "@/utils/validations/codeLink";
import { validateArticleInfoI18nConstraints } from "@/utils/validations/articleInfo";
import { validateFileToken } from "@/utils/validations/fileToken";
import path from "path";
import { getPathForArticleFile } from "@/utils/articleFiles";

export const updateArticleRoute = route(
  api, "UpdateArticleSchema",
  async (req, fastify) => {
    const { pdfToken, ...rest } = req.body;

    validateArticleInfoI18nConstraints(rest);

    let pdf: UploadedFile | null = null;

    if (pdfToken) {
      pdf = await validateFileToken(req.em, pdfToken);
    }

    if (req.body.codeLink) {
      validateCodeLink(req.body.codeLink);
    }

    const articleRepo = req.em.getRepository(Article);

    const article = await articleRepo.findOne({
      id: req.params.articleId,
    }, {
      populate: ["latestRevision.script"],
    });

    if (!article) {
      return { 404: null };
    }

    if (article.retractTime) {
      return { 403: { reason: "retracted" as const } };
    }

    if (article.owner.id !== req.userId()) {
      return { 403: { reason: "notAuthor" as const } };
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
