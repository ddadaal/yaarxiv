import { startApp } from "../../src/app";
import { FastifyInstance } from "fastify/types/instance";
import * as registerApi from "yaarxiv-api/auth/register";
import * as loginApi from "yaarxiv-api/auth/login";

let server: FastifyInstance;

beforeEach(async () => {
  server = await startApp();
});

afterEach(async () => {
  await server.close();
});

const email = "test@test.com";
const password = "testpassword";

it("should login when the user registers", async () => {
  await server.inject({
    ...registerApi.endpoint,
    payload: { email, password  },
  });

  const resp = await server.inject({
    ...loginApi.endpoint,
    query: { id: email, password },
  });

  expect(resp.statusCode).toBe(200);
  const json = resp.json();
  expect(json.name).toBe("test");
  expect(json.role).toBe("user");
});

it("should not login when the password is wrong", async () => {
  await server.inject({
    ...registerApi.endpoint,
    payload: { email, password  },
  });

  const resp = await server.inject({
    ...loginApi.endpoint,
    query: { id: email, password: password + "bad" },
  });

  expect(resp.statusCode).toBe(401);
});
