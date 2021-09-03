import { config } from "@/core/config";
import { removePrefix } from "@/utils/minio";
import * as Minio from "minio";
import type { FsUtils } from ".";

export const createMinioStorageUtils = () => {
  if (config.storage.type !== "minio") {
    throw new Error("config.storage.type must be minio");
  }

  const { connection, bucketName } = config.storage;

  const minio = new Minio.Client(connection);

  const expectFileExists: FsUtils["expectFileExists"] = async (filePath: string) => {
    const result = await minio.statObject(bucketName, filePath);
    return result;
  };

  const expectFileNotExists: FsUtils["expectFileNotExists"] = async (filePath: string) => {
    try {
      await minio.statObject(bucketName, filePath);
      fail();
    } catch (e) {
      expect(e.code).toBe("NotFound");
    }
  };

  const removeUploadDir: FsUtils["removeUploadDir"] = async () => {
    await removePrefix(minio, bucketName);
    await minio.removeBucket(bucketName);
  };

  const createUploadDir: FsUtils["createUploadDir"] = async () => {
    await minio.makeBucket(bucketName, "cn-north-1");
  };

  const touchFile: FsUtils["touchFile"] = async (filePath, content) => {
    await minio.putObject(bucketName, filePath, content ?? Buffer.alloc(0));
  };

  return {
    createUploadDir,
    expectFileExists,
    expectFileNotExists,
    removeUploadDir,
    touchFile,
  } as FsUtils;


};
