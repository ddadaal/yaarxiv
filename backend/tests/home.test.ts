import { startApp } from "../src/app";

describe("Home", () => {

  it("should return greetings with username", async() => {
    const server = await startApp(true);

    const username = "testusername";

    const resp = await server.inject({
      method: "GET",
      url: "/",
      query: { username, password: "123" },
    });

    // jump to static
    expect(resp.json()).toStrictEqual({ hello: username });

    await server.close();

  });
});
