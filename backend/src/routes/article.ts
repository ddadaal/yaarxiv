import { FastifyInstance } from "fastify";
import * as search from "yaarxiv-api/article/search";
import * as get from "yaarxiv-api/article/get";
import * as deleteArticle from "yaarxiv-api/article/delete";
import * as uploadPDF from "yaarxiv-api/article/uploadPDF";
import { route } from "@/utils/route";
import { Article } from "@/entities/Article";

export function articlesRoutes(fastify: FastifyInstance) {


  // route<uploadPDF.UploadPDFSchema>(fastify, uploadPDF.endpoint, "UploadPDFSchema", {
  //   consumes: ["multipart/form-data"],
  //   // eslint-disable-next-line object-curly-newline
  // })(
  //   async (req, reply) => {
  //     const file = req.body.file;
  //     reply.code(201);
  //     return { token: "123" };
  //   },
  // );
}
