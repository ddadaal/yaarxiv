import { FastifyInstance } from "fastify/types/instance";
import { createMockArticles } from "tests/article/utils/data";
import { User } from "@/entities/User";
import { ArticleRevision } from "@/entities/ArticleRevision";
import { Article } from "@/entities/Article";
import { PdfUpload } from "@/entities/PdfUpload";
import { createMockUsers, MockUsers } from "tests/utils/data";
import { createTestServer } from "tests/utils/createTestServer";
import { callRoute } from "@/utils/callRoute";
import { adminDeleteUserRoute } from "@/routes/admin/deleteUser";

const articleCount = 3;


let server: FastifyInstance;

let users: MockUsers;
let articles: Article[];

beforeEach(async () => {
  server = await createTestServer();

  users = await createMockUsers(server);
  articles = await createMockArticles(server, articleCount, users);
});



afterEach(async () => {
  await server.close();
});


it("return 401 if not login.", async () => {
  const resp = await callRoute(server, adminDeleteUserRoute, {
    path: { userId: 1 },
  });

  expect(resp.statusCode).toBe(401);
});

it("return 403 if not admin", async () => {
  const resp = await callRoute(server, adminDeleteUserRoute, {
    path: { userId: 1 },
  }, users.normalUser1);

  expect(resp.statusCode).toBe(403);
});

async function countEntities(entity: any) {
  return await server.orm.em.fork().getRepository(entity).count();
}

it("delete user and all related articles", async () => {

  const resp = await callRoute(server, adminDeleteUserRoute, {
    path: { userId: users.normalUser1.id },
  }, users.adminUser);

  expect(resp.statusCode).toBe(200);

  expect(await countEntities(User)).toBe(2);
  expect(await countEntities(Article)).toBe(1);
  expect(await countEntities(ArticleRevision)).toBe(2);
  expect(await countEntities(PdfUpload)).toBe(2);

});

it("return 404 if user does not exist", async () => {
  const resp = await callRoute(server, adminDeleteUserRoute, {
    path: { userId: users.normalUser1.id + 123 },
  }, users.adminUser);

  expect(resp.statusCode).toBe(404);

});
