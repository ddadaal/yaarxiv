import { Metadata, MetadataKey } from "@/entities/Metadata";
import { queryIfSetupRoute } from "@/routes/setup/queryIfSetup";
import { callRoute } from "@/utils/callRoute";
import { FastifyInstance } from "fastify";
import { expectCodeAndJson } from "tests/utils/assertions";
import { createTestServer } from "tests/utils/createTestServer";

let server: FastifyInstance;

beforeEach(async () => {
  server = await createTestServer();
});

afterEach(async () => {
  await server.close();
});

it("returns false if not setup", async () => {
  const resp = await callRoute(server, queryIfSetupRoute, {});

  const { setup } = expectCodeAndJson(resp, 200);
  expect(setup).toBeFalse();
});

it("returns true if setup", async () => {
  const metadata = new Metadata(MetadataKey.Setup);
  await server.orm.em.persistAndFlush(metadata);

  const resp = await callRoute(server, queryIfSetupRoute, {});

  const { setup } = expectCodeAndJson(resp, 200);
  expect(setup).toBeTrue();
});
