import { config, Config } from "@/core/config";
import * as fsUtils from "./fs";
import fs from "fs";

interface FsUtils {
  removeUploadDir: () => Promise<void>;
  createUploadDir: () => Promise<void>;
  touchFile: (path: string, content?: string | Uint8Array) => Promise<void>;

  expectFile(filePath: string, exist: true): Promise<fs.Stats>;
  expectFile(filePath: string, exist: false): Promise<void>;
}

const registry: { [key in Config["storage"]["type"]]: FsUtils } = {
  "fs": fsUtils,
};

export const {
  createUploadDir,
  removeUploadDir,
  touchFile,
  expectFile,
} = registry[config.storage.type];

