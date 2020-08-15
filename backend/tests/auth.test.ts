import { startApp } from "../src/app";
import { FastifyInstance } from "fastify/types/instance";

describe("AuthController", () => {
  let server: FastifyInstance;

  beforeEach(async () => {
    server = await startApp(true);
  });

  afterEach(async () => {
    await server.close();
  });

  it("should login with username and password match", async() => {

    const username = "testusername";
    const password = "testusername";

    const resp = await server.inject({
      method: "GET",
      url: "/login",
      query: { username, password  },
    });

    expect(resp.json()).toStrictEqual({ token: username });

  });

  it("should 403 if username and password do not match", async () => {
    const username = "1";
    const password = "2";

    const resp = await server.inject({
      method: "GET",
      url: "/login",
      query: { username, password },
    });

    expect(resp.statusCode).toEqual("403");
  });

});
