import { FastifyInstance } from "fastify/types/instance";
import { startApp } from "../../src/app";
import * as api from "yaarxiv-api/admin/deleteUser";
import { adminUser, login, normalUser1 } from "../article/utils/login";
import { createMockArticles } from "tests/article/utils/data";
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

  await createMockArticles(articleCount);

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

  const resp = await server.inject({
    ...replacePathInEndpoint(api.endpoint, { userId: normalUser1.id }),
    ...login(server, adminUser),
  });

  expect(resp.statusCode).toBe(200);

  expect(await countEntities(User)).toBe(2);
  expect(await countEntities(Article)).toBe(1);
  expect(await countEntities(ArticleRevision)).toBe(2);
  expect(await countEntities(PdfUpload)).toBe(2);

});

it("return 404 if user does not exist", async () => {
  const resp = await server.inject({
    ...replacePathInEndpoint(api.endpoint, { userId: "notexists" }),
    ...login(server, adminUser),
  });
  expect(resp.statusCode).toBe(404);
});
