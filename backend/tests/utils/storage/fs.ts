import { config, Config } from "@/core/config";
import fs from "fs";
import path from "path";

const uploadConfig: Config["upload"] & { type: "fs"} = config.upload;

function getActualFilePath(filePath: string) {
  return path.join(uploadConfig.path, filePath);
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
  await fs.promises.rmdir(uploadConfig.path, { recursive: true });
}

export async function createUploadDir() {
  await fs.promises.mkdir(uploadConfig.path, { recursive: true });
}


export async function touchFile(filePath: string, content?: string | Uint8Array) {
  const actualPath = getActualFilePath(filePath);

  await fs.promises.mkdir(path.dirname(actualPath), { recursive: true });

  const handle = await fs.promises.open(actualPath, "w");

  if (content) {
    handle.writeFile(content);
  }

  await handle.close();
}
