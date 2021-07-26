import fp from "fastify-plugin";
import fs from "fs";
import { config } from "@/utils/config";
import { dirname, join, resolve } from "path";
import { pipeline } from "stream";
import util from "util";
const pump = util.promisify(pipeline);

export interface Storage {
  saveFile: (path: string, data: NodeJS.ReadableStream) => Promise<void>;
}

declare module "fastify" {
  interface FastifyInstance {
    storage: Storage;
  }

}

export const storagePlugin = fp(async (fastify) => {

  const uploadPath = resolve(config.upload.path);

  const saveFile: Storage["saveFile"] = async (path, data) => {

    fastify.log.info(`Start saving file ${path}`);

    // create folder if not exist
    const fullPath = join(uploadPath, path);
    const dir = dirname(fullPath);
    await fs.promises.mkdir(dir, { recursive: true });

    await pump(data, fs.createWriteStream(fullPath));

    fastify.log.info(`File ${path} has been saved.`);
  };

  fastify.decorate("storage", {
    saveFile,
  });

});
