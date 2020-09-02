import { getConfig } from "@/utils/config";
import fp from "fastify-plugin";
import fastifyStatic from "fastify-static";
import path from "path";
import urljoin from "url-join";
import fs from "fs";

export const staticPlugin = fp(async (fastify) => {

  const uploadPath = path.resolve(getConfig("upload.path"));

  // make sure the patht exists.
  await fs.promises.mkdir(uploadPath, { recursive: true });

  fastify.register(fastifyStatic, {
    root: uploadPath,
    prefix: "/" + urljoin(getConfig("staticPrefix"), getConfig("upload.path")),
  });
});
