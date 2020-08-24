/* eslint-disable max-len */
import { fromApiDefinition } from "./fetch";
import * as search from "yaarxiv-api/article/search";
import * as get from "yaarxiv-api/article/get";
import * as uploadPDF from "yaarxiv-api/article/uploadPDF";
import * as uploadArticle from "yaarxiv-api/article/upload";

export const articleApis = () => ({
  search: fromApiDefinition<search.SearchArticleSchema>(search.endpoint),
  get: fromApiDefinition<get.GetArticleSchema>(get.endpoint),
  uploadPDF: async (file: File) => {
    const api = fromApiDefinition<uploadPDF.UploadPDFSchema>(uploadPDF.endpoint);
    const formData = new FormData();
    formData.set("file", file);
    return await api({ body: formData as any }, { bodyStringify: false });
  },
  uploadArticle: fromApiDefinition<uploadArticle.UploadArticleSchema>(uploadArticle.endpoint),
});

