import { Article } from "@/entities/Article";
import { ArticleRevision } from "@/entities/ArticleRevision";
import { route } from "@/core/route";
import * as api from "yaarxiv-api/api/article/upload";
import { Reference } from "@mikro-orm/core";
import { toRef } from "@/utils/orm";
import { validateArticleInfoI18nConstraints } from "yaarxiv-api/api/article/models";
import path from "path";
import { getPathForArticleFile } from "@/utils/articleFiles";
import { getCodeLinkInfo } from "yaarxiv-api/api/utils/codeLink";
import { UploadedFile } from "@/entities/UploadedFile";

export const uploadArticleRoute = route(
  api, "UploadArticleSchema",
  async (req, fastify) => {
    const { pdfToken, codeLink, ...rest } = req.body;

    if (!validateArticleInfoI18nConstraints(rest)) {
      return { 400: { code: "ARTICLEINFO_I18N_CONSTRAINTS" } } as const;
    }

    if (codeLink && !getCodeLinkInfo(codeLink)) {
      return { 400: { code: "CODE_LINK_INVALID" } } as const;
    }

    const pdf = await req.em.findOne(UploadedFile, { id: pdfToken });

    if (!pdf) {
      return { 400: { code: "FILE_TOKEN_INVALID" } } as const;
    }

    const user = req.dbUserRef();

    const createTime = new Date();

    const article = new Article({
      createTime: createTime,
      lastUpdateTime: createTime,
      owner: user,
    });

    const rev = new ArticleRevision({
      script: Reference.create(pdf),
      article,
      codeLink,
      revisionNumber: 1,
      category: "",
      time: createTime,
      ...rest,
    });

    article.revisions.add(rev);
    article.latestRevision = toRef(rev);

    await req.em.persistAndFlush(article);

    // move the file to /{user.id}/{article.id}/
    const filename = path.basename(pdf.filePath);
    const newPath = getPathForArticleFile(article, filename);

    await fastify.storage.moveFile(pdf.filePath, newPath);

    pdf.filePath = newPath;

    await req.em.flush();

    return { 201: { id: article.id } };

  });
