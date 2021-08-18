import "reflect-metadata";
import fastify, { FastifyInstance, FastifyPluginAsync, FastifyPluginCallback } from "fastify";
import { routes }  from "./routes";
import { models } from "@/core/schemas";
import { plugins } from "./plugins";
import { config } from "@/core/config";
import { registerRoute } from "./core/route";
import createError from "fastify-error";

type Plugin = FastifyPluginAsync | FastifyPluginCallback;
type PluginOverrides = Map<Plugin, Plugin>;

function applyPlugins(server: FastifyInstance, pluginOverrides?: PluginOverrides) {
  plugins.forEach((plugin) => {
    server.register(pluginOverrides && pluginOverrides.has(plugin)
      ? pluginOverrides.get(plugin)!
      : plugin);
  });
}

const ValidationError = createError("VALIDATION_ERROR", "Errors occurred when validating %s. Errors are \n%o", 400);

export function buildApp(pluginOverrides?: PluginOverrides) {

  const server = fastify({
    logger: config.logger,
    ajv: {
      customOptions: {
        coerceTypes: "array",
      },
    },
    schemaErrorFormatter: (errors, dataVar) => {
      return new ValidationError(dataVar, errors);
    },
    pluginTimeout: config.pluginTimeout,
  });

  server.log.info(`Loaded config: \n${JSON.stringify(config, null, 2)}`);

  Object.values(models).forEach((s) => server.addSchema(s));

  applyPlugins(server, pluginOverrides);

  routes.forEach((r) => registerRoute(server, r));

  return server;
}

export async function startServer(server: FastifyInstance) {
  await server.listen(config.port, config.address).catch((err) => {
    server.log.error(err);
    throw err;
  });
}
