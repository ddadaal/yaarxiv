import { startApp } from "../src/app";
import { FastifyInstance } from "fastify";

describe("Home", () => {

  let server: FastifyInstance;

  beforeEach(async () => {
    server = await startApp();
  });

  afterEach(async () => {
    await server.close();
  });


  it("should return greetings with username", async() => {

    const username = "testusername";

    const resp = await server.inject({
      method: "GET",
      url: "/",
      query: { username },
    });

    expect(resp.json()).toStrictEqual({ hello: username });
  });
});
