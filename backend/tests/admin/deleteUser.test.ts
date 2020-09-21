import { FastifyInstance } from "fastify/types/instance";
import { startApp } from "../../src/app";
import * as api from "yaarxiv-api/admin/deleteUser";
import { adminUser, login, normalUser1 } from "../article/utils/login";
import { insertData } from "tests/article/utils/data";
import { replacePathInEndpoint } from "tests/utils/replacePathInEndpoint";
import { getRepository } from "typeorm";
import { User } from "@/entities/User";
import { ArticleRevision } from "@/entities/ArticleRevision";
import { Article } from "@/entities/Article";
import { PdfUpload } from "@/entities/PdfUpload";

const articleCount = 3;

let server: FastifyInstance;

beforeEach(async () => {
  server = await startApp();

  await insertData(articleCount);

});

afterEach(async () => {
  await server.close();
});


it("return 401 if not login.", async () => {
  const resp = await server.inject({ ...api.endpoint });

  expect(resp.statusCode).toBe(401);

});

it("return 403 if not admin", async () => {
  const resp = await server.inject({
    ...api.endpoint ,
    ...login(server, normalUser1),
  });

  expect(resp.statusCode).toBe(403);
});

async function countEntities(entity) {
  return await getRepository(entity).count();
}

it("delete user and all related articles", async () => {

  const prevRevs = await getRepository(ArticleRevision).createQueryBuilder("a").getManyAndCount();

  const resp = await server.inject({
    ...replacePathInEndpoint(api.endpoint, { userId: normalUser1.id }),
    ...login(server, adminUser),
  });

  expect(resp.statusCode).toBe(200);

  expect(await countEntities(User)).toBe(2);
  expect(await countEntities(Article)).toBe(1);
  const articles = await getRepository(Article).createQueryBuilder("a").getManyAndCount();
  const revs = await getRepository(ArticleRevision).createQueryBuilder("a").getManyAndCount();

});
