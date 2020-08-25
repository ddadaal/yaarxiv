/* eslint-disable max-len */
import { fromApi } from "./fetch";
import * as search from "yaarxiv-api/article/search";
import * as get from "yaarxiv-api/article/get";
import * as uploadPDF from "yaarxiv-api/article/uploadPDF";
import * as uploadArticle from "yaarxiv-api/article/upload";
import * as deleteArticle from "yaarxiv-api/article/delete";

export const articleApis = () => ({
  search: fromApi<search.SearchArticleSchema>(search.endpoint),
  get: fromApi<get.GetArticleSchema>(get.endpoint),
  uploadPDF: async (file: File) => {
    const api = fromApi<uploadPDF.UploadPDFSchema>(uploadPDF.endpoint);
    const formData = new FormData();
    formData.set("file", file);
    return await api({ body: formData as any }, { bodyStringify: false });
  },
  uploadArticle: fromApi<uploadArticle.UploadArticleSchema>(uploadArticle.endpoint),
  deleteArticle: fromApi<deleteArticle.DeleteArticleSchema>(deleteArticle.endpoint),
});

