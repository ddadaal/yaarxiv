import { User } from "@/entities/User";
import { Reference } from "@mikro-orm/core";
import { FastifyInstance } from "fastify";
import { PdfUpload } from "../../../src/entities/PdfUpload";
import { range } from "../../../src/utils/array";
import { generateArticle } from "./generateArticles";

export function generatePdf(owner: User) {

  const pdf = new PdfUpload();
  pdf.user = Reference.create(owner);
  pdf.link = "test";
  return pdf;
}

export async function createMockArticles(fastify: FastifyInstance, articleCount: number) {
  // insert pdf
  // const pdfRepo = getRepository(PdfUpload);
  // const pdf = generatePdf();
  // await pdfRepo.save(pdf);

  // insert articles
  const articles = range(1, articleCount + 1).map((i) => generateArticle(i));
  await fastify.orm.em.persistAndFlush(articles);

  return articles;

}
