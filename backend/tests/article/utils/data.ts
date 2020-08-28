import { FastifyInstance } from "fastify";
import { Article } from "../../../src/entities/Article";
import { range } from "../../../src/utils/array";
import { generateArticle } from "./generateArticles";
import { insertUserInfo } from "./login";

export async function fillData(fastify: FastifyInstance, articleCount: number) {

  const generator = fastify.orm.getSchemaGenerator();
  await generator.createSchema();

  const em = fastify.orm.em.fork();

  await insertUserInfo(em);

  const articles = range(0, articleCount).map(generateArticle);
  // append items
  const articleRepo = em.getRepository(Article);
  articleRepo.persist(articles);

  await em.flush();

  return em;
}

export async function dropData(fastify: FastifyInstance) {
  const generator = fastify.orm.getSchemaGenerator();
  await generator.dropSchema();
}
