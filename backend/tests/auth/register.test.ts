import { startApp } from "../../src/app";
import { FastifyInstance } from "fastify/types/instance";
import * as registerApi from "yaarxiv-api/auth/register";

let server: FastifyInstance;

beforeEach(async () => {
  server = await startApp();
});

afterEach(async () => {
  await server.close();
});

const email = "test@test.com";
const password = "testpassword";

it("should register and return token and name", async () => {

  const resp = await server.inject({
    ...registerApi.endpoint,
    payload: { email, password  },
  });

  const json = resp.json();
  expect(resp.statusCode).toBe(201);
  expect(json.name).toStrictEqual("test");
});

it("should error if one email registers twice", async () => {

  await server.inject({
    ...registerApi.endpoint,
    payload: { email, password  },
  });

  const resp = await server.inject({
    ...registerApi.endpoint,
    payload: { email, password  },
  });

  expect(resp.statusCode).toBe(405);
});

it("should fail if input email is not a valid email address", async () => {
  const resp = await server.inject({
    ...registerApi.endpoint,
    payload: { email: "123", password: "123" },
  });

  expect(resp.statusCode).toBe(400);
});
