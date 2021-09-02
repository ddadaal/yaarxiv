import fp from "fastify-plugin";
import fs from "fs";
import { config } from "@/core/config";
import { dirname, join, resolve } from "path";
import { pipeline } from "stream";
import util from "util";
import type { Storage } from ".";
import { FastifyReply } from "fastify";
import fastifyStatic from "fastify-static";

const pump = util.promisify(pipeline);

export const fsStoragePlugin = fp(async (fastify) => {

  if (config.storage.type !== "fs") {
    throw new RangeError("fs storage can only be used when upload.type === fs");
  }

  const uploadPath = resolve(config.storage.path);

  // create the root upload path
  fastify.log.info(`Creating root storage path ${uploadPath}`);
  await fs.promises.mkdir(uploadPath, { recursive: true });
  fastify.log.info("Root storage path are created.");

  // register fastify-static to serve file
  fastify.register(fastifyStatic, {
    root: uploadPath,
    serve: false,
  });

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

  const moveFile: Storage["moveFile"] = async (from, to) => {
    fastify.log.info(`Starting moving filr from ${from} to ${to}.`);

    const toPath = getActualPath(to);

    await fs.promises.mkdir(dirname(toPath), { recursive: true });

    await fs.promises.rename(getActualPath(from), toPath);

    fastify.log.info(`File ${from} has been moved to ${to}.`);
  };

  const rmdir: Storage["rmdir"] = async (path) => {
    fastify.log.info(`Starting rmdir ${path}.`);

    const toPath = getActualPath(path);

    await fs.promises.rmdir(toPath, { recursive: true });

    fastify.log.info(`Dir ${path} has been removed.`);
  };

  const serveFile: FastifyReply["serveFile"] = function (path) {
    return this.sendFile(path, uploadPath);
  };

  fastify.decorate("storage", {
    saveFile,
    removeFile,
    moveFile,
    rmdir,
  });

  fastify.decorateReply("serveFile", serveFile);


});
