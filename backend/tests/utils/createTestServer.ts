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
    // attach the stacktrace
    e.message = JSON.stringify({
      message: e,
      stack: e.stack,
    });
    rep.send(e);
  });

  await build?.(server);

  await server.ready();


  return server;
}

