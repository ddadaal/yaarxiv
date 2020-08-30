import { route } from "@/utils/route";
import { FastifyInstance, FastifyRequest } from "fastify";
import { pipeline } from "stream";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import * as api from "yaarxiv-api/article/uploadPDF";
import { config } from "node-config-ts";
import { PdfUpload } from "@/entities/PdfUpload";

const pump = promisify(pipeline);

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

type Multipart = ThenArg<ReturnType<FastifyRequest["file"]>>;

// Save uploaded pdf to /{uploadPath}/{userId}/{current date}_{filename}
export async function uploadPdfRoute(fastify: FastifyInstance) {
  route<api.UploadPDFSchema>(fastify, api.endpoint, "UploadPDFSchema", {
    authOption: true,
    consumes: ["multipart/form-data"],
  })(
    async (req) => {
      const data = req.body.file as any as Multipart;

      const userId = req.userId();

      const filename =`${Date.now()}_${data.filename}`;
      const fileRelativePath = path.join(userId, filename);

      const filePath = path.join(config.upload.path, fileRelativePath);

      req.log.info(`Received file ${data.filename} from ${userId} saving to ${filePath}.`);

      // create the path if not exists
      await fs.promises.mkdir(path.join(config.upload.path, userId), { recursive: true });
      await pump(data.file, fs.createWriteStream(filePath));

      req.log.info(`${filePath} saved successfully.`);

      const repo = fastify.orm.getRepository(PdfUpload);

      const pdf = new PdfUpload();
      pdf.link = fileRelativePath;
      pdf.userId = userId;

      await repo.save(pdf);

      req.log.info(`${fileRelativePath} persisted into database as ${pdf.id}.`);

      return { 201: { token: pdf.id } };

    },
  );
}
