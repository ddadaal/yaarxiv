/* eslint-disable max-len */
import { fromApiDefinition } from "./fetch";
import * as search from "yaarxiv-api/article/search";
import * as getWithInfo from "yaarxiv-api/article/getWithId";
import * as getWithRevision from "yaarxiv-api/article/getWithRevision";
import * as uploadPDF from "yaarxiv-api/article/uploadPDF";
import * as uploadArticle from "yaarxiv-api/article/upload";

export const articleApis = () => ({
  search: fromApiDefinition<search.SearchArticleSchema>(search.endpoint),
  getWithId: fromApiDefinition<getWithInfo.GetArticleWithIdSchema>(getWithInfo.endpoint),
  getWithIdAndRevision: fromApiDefinition<getWithRevision.GetArticleWithIdAndRevisionSchema>(getWithRevision.endpoint),
  uploadPDF: fromApiDefinition<uploadPDF.UploadPDFSchema>(uploadPDF.endpoint),
  uploadArticle: fromApiDefinition<uploadArticle.UploadArticleSchema>(uploadArticle.endpoint),
});

