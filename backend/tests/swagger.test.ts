import { startApp } from "../src/app";

describe("Swagger", () => {

  it("should return swagger definitions", async() => {
    const server = await startApp(true, { loadSwagger: true });

    const resp = await server.inject({
      method: "GET",
      url: "/swagger",
    });

    // jump to static
    expect(resp.statusCode).toBe(302);

    await server.close();

  });
});
