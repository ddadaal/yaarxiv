import fp from "fastify-plugin";
import { config } from "@/core/config";
import type { Storage } from ".";
import { FastifyReply } from "fastify";
import * as Minio from "minio";
import { removePrefix } from "@/utils/minio";
import mime from "mime-types";
import { extname } from "path";
import waitOn from "wait-on";



export const minioStoragePlugin = fp(async (fastify) => {

  if (config.storage.type !== "minio") {
    throw new RangeError("minio storage can only be used when upload.type === minio");
  }

  const { connection, bucketName } = config.storage;

  const logger = fastify.log.child({ plugin: "MinioStorage" });

  // wait for minio to be alive
  logger.info("Waiting for minio to be alive.");

  await waitOn({
    resources: [`tcp:${connection.endPoint}:${connection.port}`],
    timeout: connection.connectionTimeout,
  });

  logger.info("minio is alive.");

  const minio = new Minio.Client(connection);

  logger.info(`Using bucket ${bucketName}`);

  // create bucket if not exists
  if (!await minio.bucketExists(bucketName)) {
    logger.info(`Bucket ${bucketName} doesn't exist. Creating...`);
    await minio.makeBucket(bucketName, "cn-north-1");
    logger.info(`Bucket ${bucketName} has been created.`);
  }

  const saveFile: Storage["saveFile"] = async (path, data) => {
    logger.info(`Start saving file ${path}`);
    const resp = await minio.putObject(bucketName, path, data);
    logger.info(`File ${path} has been saved. Info: ${resp}`);
  };

  const removeFile: Storage["removeFile"] = async (path) => {
    logger.info(`Start removing file ${path}`);
    await minio.removeObject(bucketName, path);
    logger.info(`File ${path} has been removed.`);
  };

  const moveFile: Storage["moveFile"] = async (from, to) => {
    fastify.log.info(`Starting moving file from ${from} to ${to}.`);

    await minio.copyObject(bucketName, to, `${bucketName}/${from}`, new Minio.CopyConditions());
    await minio.removeObject(bucketName, from);

    fastify.log.info(`File ${from} has been moved to ${to}.`);
  };

  const rmdir: Storage["rmdir"] = async (dir) => {
    fastify.log.info(`Starting removing dir ${dir}`);

    const objectNames = await removePrefix(minio, bucketName, dir);

    fastify.log.info(`Dir ${dir} has been removed. Removed objects: ${objectNames.join(", ")}`);
  };

  fastify.decorate("storage", {
    saveFile,
    removeFile,
    moveFile,
    rmdir,
  });

  const serveFile: FastifyReply["serveFile"] = async function (path) {
    // get the length
    const stats = await minio.statObject(bucketName, path);

    // get the content-type
    const mimeType = mime.contentType(extname(path)) || "application/octet-stream";

    this.headers({ "content-length": stats.size, "content-type": mimeType });

    const file = await minio.getObject(bucketName, path);
    await this.send(file);
  };

  fastify.decorateReply("serveFile", serveFile);
});
