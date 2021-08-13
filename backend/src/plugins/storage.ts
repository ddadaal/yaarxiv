import fp from "fastify-plugin";
import fs from "fs";
import { config } from "@/utils/config";
import { dirname, join, resolve } from "path";
import { pipeline } from "stream";
import util from "util";
const pump = util.promisify(pipeline);

export interface Storage {
  saveFile: (path: string, data: NodeJS.ReadableStream) => Promise<void>;
  removeFile: (path: string) => Promise<void>;
}

declare module "fastify" {
  interface FastifyInstance {
    storage: Storage;
  }

}

export const storagePlugin = fp(async (fastify) => {

  const uploadPath = resolve(config.upload.path);

  // create the root upload path
  fastify.log.info("Creating root storage path");
  await fs.promises.mkdir(uploadPath, { recursive: true });
  fastify.log.info("Root storage path are created.");

  const getActualPath = (path: string) => join(uploadPath, path);

  const saveFile: Storage["saveFile"] = async (path, data) => {

    fastify.log.info(`Start saving file ${path}`);

    // create folder if not exist
    const fullPath = getActualPath(path);
    const dir = dirname(fullPath);

    await fs.promises.mkdir(dir, { recursive: true });

    await pump(data, fs.createWriteStream(fullPath));

    fastify.log.info(`File ${path} has been saved.`);
  };

  const removeFile: Storage["removeFile"] = async (path) => {
    fastify.log.info(`Start deleting file ${path}`);

    const fullPath = getActualPath(path);
    await fs.promises.unlink(fullPath);

    fastify.log.info(`File ${path} has been deleted.`);
  };

  fastify.decorate("storage", {
    saveFile,
    removeFile,
  });

});
