import { Metadata, MetadataKey } from "@/entities/Metadata";
import { User, UserRole } from "@/entities/User";
import { setupRoute } from "@/routes/setup/setup";
import { callRoute } from "@/utils/callRoute";
import { FastifyInstance } from "fastify";
import { SetupSchema } from "yaarxiv-api/api/setup/setup";
import { createTestServer } from "tests/utils/createTestServer";

let server: FastifyInstance;

beforeEach(async () => {
  server = await createTestServer();
});

afterEach(async () => {
  await server.close();
});

const info: SetupSchema["body"] = {
  admin: {
    email: "admin@admin.com",
    password: "admin",
  },
};

it("sets up the system", async () => {
  const resp = await callRoute(server, setupRoute, { body: info });
  expect(resp.statusCode).toBe(201);

  const em = server.orm.em.fork();

  expect(await Metadata.getMetadata(em, MetadataKey.Setup)).not.toBeNull();

  const adminUser = await em.findOneOrFail(User, { email: info.admin.email });

  expect(adminUser.email).toBe(info.admin.email);
  expect(await adminUser.passwordMatch(info.admin.password)).toBeTrue();
  expect(adminUser.role).toBe(UserRole.Admin);
  expect(adminUser.validated).toBeTrue();
});

it("returns 409 if already setup", async () => {
  const metadata = new Metadata(MetadataKey.Setup);
  await server.orm.em.persistAndFlush(metadata);

  const resp = await callRoute(server, setupRoute, { body: info });
  expect(resp.statusCode).toBe(409);
});
