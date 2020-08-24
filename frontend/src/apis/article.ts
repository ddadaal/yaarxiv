/* eslint-disable max-len */
import { fromApiDefinition } from "./fetch";
import * as search from "yaarxiv-api/article/search";
import * as get from "yaarxiv-api/article/get";
import * as uploadPDF from "yaarxiv-api/article/uploadPDF";
import * as uploadArticle from "yaarxiv-api/article/upload";

export const articleApis = () => ({
  search: fromApiDefinition<search.SearchArticleSchema>(search.endpoint),
  get: fromApiDefinition<get.GetArticleSchema>(get.endpoint),
  uploadPDF: fromApiDefinition<uploadPDF.UploadPDFSchema>(uploadPDF.endpoint),
  uploadArticle: fromApiDefinition<uploadArticle.UploadArticleSchema>(uploadArticle.endpoint),
});

