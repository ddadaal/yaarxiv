import { Config, config } from "@/core/config";
import { fsStoragePlugin } from "@/plugins/storage/fs";
import { minioStoragePlugin } from "@/plugins/storage/minio";
import fp from "fastify-plugin";
import { Readable } from "stream";

export interface Storage {
  saveFile: (path: string, data: Readable) => Promise<void>;
  removeFile: (path: string) => Promise<void>;
  moveFile: (from: string, to: string) => Promise<void>;
  rmdir: (dir: string) => Promise<void>;
}

declare module "fastify" {
  interface FastifyInstance {
    storage: Storage;
  }

  interface FastifyReply {
    serveFile: (this: FastifyReply, path: string) => Promise<void>;
  }
}

const registry: { [k in Config["storage"]["type"]]: ReturnType<typeof fp>} = {
  "fs": fsStoragePlugin,
  "minio": minioStoragePlugin,
};

export const storagePlugin = registry[config.storage.type];
