import fp from "fastify-plugin";
import fileUpload from "fastify-file-upload";
import { config } from "@/utils/config";

export const uploadPlugin = fp(async (fastify) => {

  fastify.register(fileUpload, {
    limits: { fileSize: config.upload.maxFileSize },
    createParentPath: true,
    abortOnLimit: true,
  });
});

// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/express-fileupload/index.d.ts
export interface UploadedFile {
  /** file name */
  name: string;
  /** A function to move the file elsewhere on your server */
  mv(path: string, callback: (err: any) => void): void;
  mv(path: string): Promise<void>;
  /** Encoding type of the file */
  encoding: string;
  /** The mimetype of your file */
  mimetype: string;
  /** A buffer representation of your file, returns empty buffer in case useTempFiles option was set to true. */
  data: Buffer;
  /** A path to the temporary file in case useTempFiles option was set to true. */
  tempFilePath: string;
  /** A boolean that represents if the file is over the size limit */
  truncated: boolean;
  /** Uploaded size in bytes */
  size: number;
  /** MD5 checksum of the uploaded file */
  md5: string;
}
