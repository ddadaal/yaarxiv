import { route } from "@/utils/route";
import { FastifyInstance } from "fastify";
import path from "path";
import * as api from "yaarxiv-api/article/uploadPDF";
import { config } from "node-config-ts";
import { PdfUpload } from "@/entities/PdfUpload";
import { UploadedFile } from "@/utils/upload";

// Save uploaded pdf to /{uploadPath}/{userId}/{current date}_{filename}
export async function uploadPdfRoute(fastify: FastifyInstance) {
  route<api.UploadPDFSchema>(fastify, api.endpoint, "UploadPDFSchema", {
    authOption: true,
    consumes: ["multipart/form-data"],
  })(
    async (req) => {
      const data = req.body.file as UploadedFile;

      const userId = req.userId();

      const filename =`${Date.now()}_${data.name}`;
      const fileRelativePath = path.join(userId, filename);

      const filePath = path.join(config.upload.path, fileRelativePath);

      req.log.info(`Received file ${data.name} from ${userId}.
      Saving it to ${filePath}.`);

      await data.mv(filePath);

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
