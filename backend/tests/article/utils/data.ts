import { User } from "@/entities/User";
import { EntityManager } from "@mikro-orm/core";
import { PdfUpload } from "../../../src/entities/PdfUpload";
import { range } from "../../../src/utils/array";
import { generateArticle } from "./generateArticles";
import { insertUserInfo, normalUser1 } from "./login";

export function generatePdf(em: EntityManager) {

  const pdf = new PdfUpload();
  pdf.user = em.getReference(User, normalUser1.id);
  pdf.link = "test";
  return pdf;
}

export async function insertData(em: EntityManager, articleCount: number) {
  // insert p
  await insertUserInfo(em);

  // insert pdf
  // const pdfRepo = getRepository(PdfUpload);
  // const pdf = generatePdf();
  // await pdfRepo.save(pdf);

  // insert articles
  const articles = range(1, articleCount+1).map((i) => generateArticle(em, i));
  await em.persistAndFlush(articles);
}
