import { buildApp } from "@/app";
import { mailPlugin } from "@/plugins/mail";
import { FastifyInstance } from "fastify";
import { mockMailPlugin } from "tests/mocks/mail.mock";

export async function createTestServer(build?: (server: FastifyInstance) => void | Promise<void>) {
  const pluginOverrides = new Map([
    [mailPlugin, mockMailPlugin],
  ]);
  const server = buildApp(pluginOverrides);

  // fails the process if there is error
  server.setErrorHandler((e, req, rep) => {
    // pass if it's validation error
    if (e.statusCode !== 400 && !e.validation) {
      throw e;
    } else {
      rep.send(e);
    }
  });

  await build?.(server);

  await server.ready();


  return server;
}

