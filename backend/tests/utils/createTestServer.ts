import { buildApp } from "@/app";
import { config } from "@/core/config";
import { mailPlugin } from "@/plugins/mail";
import { FastifyInstance } from "fastify";
import { mockMailPlugin } from "tests/mocks/mail.mock";

export async function createTestServer(build?: (server: FastifyInstance) => void | Promise<void>) {
  const pluginOverrides = new Map([
    [mailPlugin, mockMailPlugin],
  ]);

  // update the config to `yaarxiv_test_${env.JEST_WORKER_ID}`
  config.orm.dbName = `yaarxiv_test_${process.env.JEST_WORKER_ID}`;

  const server = buildApp(pluginOverrides);

  // fails the process if there is error
  server.setErrorHandler((e, req, rep) => {
    // attach the stacktrace
    e.message = JSON.stringify({
      message: e.message,
      stack: e.stack,
    });
    rep.send(e);
  });

  await build?.(server);

  await server.ready();


  return server;
}

