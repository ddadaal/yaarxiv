import { config } from "@/core/config";
import fs from "fs";
import path from "path";
import type { FsUtils } from ".";

export const createFSStorageUtils = () => {

  if (config.storage.type !== "fs") {
    throw new Error("config.storage.type must be fs");
  }

  const storageConfig = config.storage;

  function getActualFilePath(filePath: string) {
    return path.join(storageConfig.path, filePath);
  }

  const expectFileExists: FsUtils["expectFileExists"] = async (filePath: string) => {
    const fullPath = getActualFilePath(filePath);
    expect(fs.existsSync(fullPath)).toBeTrue();
    return fs.promises.stat(fullPath);
  };

  const expectFileNotExists: FsUtils["expectFileNotExists"] = async (filePath: string) => {
    const fullPath = getActualFilePath(filePath);
    expect(fs.existsSync(fullPath)).toBeFalse();
  };

  const removeUploadDir: FsUtils["removeUploadDir"] = async () => {
    await fs.promises.rmdir(storageConfig.path, { recursive: true });
  };

  const createUploadDir: FsUtils["createUploadDir"] = async () => {
    await fs.promises.mkdir(storageConfig.path, { recursive: true });
  };

  const touchFile: FsUtils["touchFile"] = async (filePath, content) => {
    const actualPath = getActualFilePath(filePath);

    await fs.promises.mkdir(path.dirname(actualPath), { recursive: true });

    const handle = await fs.promises.open(actualPath, "w");

    if (content) {
      handle.writeFile(content);
    }

    await handle.close();
  };

  return {
    createUploadDir,
    expectFileExists,
    expectFileNotExists,
    removeUploadDir,
    touchFile,
  } as FsUtils;

};
