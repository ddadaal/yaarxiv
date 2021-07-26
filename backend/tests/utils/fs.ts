import { config } from "@/utils/config";
import fs from "fs";
import path from "path";

export function getFullFilePath(filePath: string) {
  return path.join(config.upload.path, filePath);
}

export function expectFileExist(filePath: string, exist = true) {
  expect(fs.existsSync(path.join(config.upload.path, filePath))).toBe(exist);
}

export async function removeUploadDir() {
  await fs.promises.rmdir(config.upload.path, { recursive: true });
}
