import { startApp } from "../src/app";

describe("tests", () => {

  it("should return { hello: \"world\"", async() => {
    const server = await startApp();

    const resp = await server.inject({
      method: "GET",
      url: "/",
    });

    expect(resp.json()).toEqual({ hello: "world" });

    await server.close();

  });
});
