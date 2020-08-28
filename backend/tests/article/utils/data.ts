import { FastifyInstance } from "fastify";
import { EntityRepository } from "mikro-orm";
import { Article } from "../../../src/entities/Article";
import { range } from "../../../src/utils/array";
import { generateArticle } from "./generateArticles";
import { insertUserInfo } from "./login";

export async function fillData(fastify: FastifyInstance, articleCount: number) {

  const generator = fastify.orm.getSchemaGenerator();
  await generator.createSchema();

  await insertUserInfo(fastify);

  const articles = range(0, articleCount).map(generateArticle);
  // append items
  const articleRepo = fastify.orm.em.getRepository(Article);
  await articleRepo.persistAndFlush(articles);

  return articles;
}

export async function dropData(fastify: FastifyInstance) {
  const generator = fastify.orm.getSchemaGenerator();
  await generator.dropSchema();
}
