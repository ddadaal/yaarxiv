import { FastifyInstance } from "fastify";
import { Article } from "../../../src/entities/Article";
import { range } from "../../../src/utils/array";
import { generateArticle } from "./generateArticles";
import { insertUserInfo } from "./login";

export async function fillData(fastify: FastifyInstance, articleCount: number) {

  await insertUserInfo(fastify);

  const articles = range(0, articleCount).map(generateArticle);
  // append items
  const articleRepo = fastify.orm.em.getRepository(Article);
  await articleRepo.persistAndFlush(articles);

  return articles;
}

export async function dropData(fastify: FastifyInstance) {
  const generator = fastify.orm.getSchemaGenerator();
  generator.dropSchema();
}
