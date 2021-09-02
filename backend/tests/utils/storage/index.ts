import { config, Config } from "@/core/config";
import { createFSStorageUtils } from "tests/utils/storage/fs";
import { createMinioStorageUtils } from "tests/utils/storage/minio";

export interface FileInfo {
  size: number;
}

export interface FsUtils {
  removeUploadDir: () => Promise<void>;
  createUploadDir: () => Promise<void>;
  touchFile: (path: string, content?: string | Buffer) => Promise<void>;

  expectFileExists(filePath: string): Promise<FileInfo>;
  expectFileNotExists(filePath: string): Promise<void>;
}

const registry: { [key in Config["storage"]["type"]]: () => FsUtils } = {
  "fs": createFSStorageUtils,
  "minio": createMinioStorageUtils,
};

export const {
  createUploadDir,
  removeUploadDir,
  touchFile,
  expectFileExists,
  expectFileNotExists,
} = registry[config.storage.type]();

