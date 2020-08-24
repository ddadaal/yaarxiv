import { FastifyInstance } from "fastify";
import * as search from "yaarxiv-api/article/search";
import * as uploadPDF from "yaarxiv-api/article/uploadPDF";
import { route } from "@/utils/route";

export async function articlesRoutes(fastify: FastifyInstance) {
  route<search.SearchArticleSchema>(fastify, search.endpoint, "SearchArticleSchema", { summary: search.summary })(
    async (req, reply) => {
      return { results: [], totalCount: 0 };
    });

  route<uploadPDF.UploadPDFSchema>(fastify, uploadPDF.endpoint, "UploadPDFSchema", {
    consumes: ["multipart/form-data"],
  // eslint-disable-next-line object-curly-newline
  })(
    async (req, reply) => {
      const file = req.body.file;
      fastify.log.info(JSON.stringify(file));
      reply.code(201);
      return { token: "123" };
    },
  );
}
