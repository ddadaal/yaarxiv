import { User } from "../src/entities/User";
import {  buildApp } from "../src/app";

describe("tests", () => {


  it("should return { hello: \"world\"", async() => {
    const server = await buildApp({
      db: {
        type: "sqlite",
        database: ":memory:",
        dropSchema: true,
        entities: [User],
        synchronize: true,
        logging: false,
      },
      fastify: { logger: false },
    });

    const resp = await server.inject({
      method: "GET",
      url: "/",
    });

    expect(resp.json()).toEqual({ hello: "world" });

    await server.close();

  });
});
