export interface Storage {
  saveFile: (path: string, data: NodeJS.ReadableStream) => Promise<void>;
  removeFile: (path: string) => Promise<void>;
  moveFile: (from: string, to: string) => Promise<void>;
  rmdir: (dir: string) => Promise<void>;
}

declare module "fastify" {
  interface FastifyInstance {
    storage: Storage;
  }

  interface FastifyReply {
    serveFile: (this: FastifyReply, path: string) => FastifyReply;
  }
}

