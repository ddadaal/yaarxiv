import { config } from "@/utils/config";
import fs from "fs";
import path from "path";

export function getFullFilePath(filePath: string) {
  return path.join(config.upload.path, filePath);
}

export async function expectFile(filePath: string, exist = true): Promise<fs.Stats> {
  const fullPath = path.join(config.upload.path, filePath);
  expect(fs.existsSync(fullPath)).toBe(exist);

  return fs.promises.stat(fullPath);
}

export async function removeUploadDir() {
  await fs.promises.rmdir(config.upload.path, { recursive: true });
}
