import fp from "fastify-plugin";
import fs from "fs";
import multipartPlugin, { Multipart } from "fastify-multipart";
import util from "util";
import { pipeline } from "stream";
import { dirname } from "path";
const pump = util.promisify(pipeline);

export const uploadPlugin = fp(async (fastify) => {
  await fastify.register(multipartPlugin, {});
});

export async function saveFile(data: Multipart, path: string) {
  // create folder if not exist
  const dir = dirname(path);
  await fs.promises.mkdir(dir, { recursive: true });

  await pump(data.file, fs.createWriteStream(path));
}
