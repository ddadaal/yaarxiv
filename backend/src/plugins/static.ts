import fp from "fastify-plugin";
import fastifyStatic from "fastify-static";
import path from "path";
import fs from "fs";
import { config } from "@/utils/config";

export const staticPlugin = fp(async (fastify) => {

  const uploadPath = path.resolve(config.upload.path);

  // make sure the patht exists.
  await fs.promises.mkdir(uploadPath, { recursive: true });

  fastify.register(fastifyStatic, {
    root: uploadPath,
    serve: false,
  });
});
