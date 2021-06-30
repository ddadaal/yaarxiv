import { User } from "@/entities/User";
import { IdentifiedReference } from "@mikro-orm/core";
import { FastifyInstance } from "fastify";
import { MockUsers } from "tests/utils/data";
import { PdfUpload } from "../../../src/entities/PdfUpload";
import { range } from "../../../src/utils/array";
import { generateArticle } from "./generateArticles";

export function generatePdf(owner: IdentifiedReference<User>) {

  const pdf = new PdfUpload();
  pdf.user = owner;
  pdf.link = "test";
  return pdf;
}

export async function createMockArticles(fastify: FastifyInstance, articleCount: number, users: MockUsers) {
  // insert pdf
  // const pdfRepo = getRepository(PdfUpload);
  // const pdf = generatePdf();
  // await pdfRepo.save(pdf);

  // insert articles
  const articles = range(1, articleCount + 1).map((i) => generateArticle(i, users));
  await fastify.orm.em.persistAndFlush(articles);

  return articles;

}
