import { getRepository } from "typeorm";
import { Article } from "../../../src/entities/Article";
import { PdfUpload } from "../../../src/entities/PdfUpload";
import { range } from "../../../src/utils/array";
import { generateArticle } from "./generateArticles";
import { insertUserInfo, normalUser1 } from "./login";

export function generatePdf() {

  const pdf = new PdfUpload();
  pdf.userId = normalUser1.id;
  pdf.link = "test";
  return pdf;
}

export async function insertData(articleCount: number) {
  // insert p
  await insertUserInfo();

  // insert pdf
  // const pdfRepo = getRepository(PdfUpload);
  // const pdf = generatePdf();
  // await pdfRepo.save(pdf);

  // insert articles
  const articles = range(0, articleCount).map((i) => generateArticle(i));
  const articleRepo = getRepository(Article);
  await articleRepo.save(articles);

}
