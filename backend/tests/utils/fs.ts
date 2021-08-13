import { config } from "@/utils/config";
import fs from "fs";
import path from "path";

export function getActualFilePath(filePath: string) {
  return path.join(config.upload.path, filePath);
}

export async function expectFile(filePath: string, exist: true): Promise<fs.Stats>
export async function expectFile(filePath: string, exist: false): Promise<void>
export async function expectFile(filePath: string, exist: boolean): Promise<fs.Stats | void> {
  const fullPath = getActualFilePath(filePath);
  expect(fs.existsSync(fullPath)).toBe(exist);

  if (exist) {
    return fs.promises.stat(fullPath);
  }
}

export async function removeUploadDir() {
  await fs.promises.rmdir(config.upload.path, { recursive: true });
}

export async function createUploadDir() {
  await fs.promises.mkdir(config.upload.path, { recursive: true });
}
