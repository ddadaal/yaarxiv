import { route } from "@/utils/route";
import { FastifyInstance } from "fastify";
import path from "path";
import * as api from "yaarxiv-api/article/uploadPDF";
import { PdfUpload } from "@/entities/PdfUpload";
import { UploadedFile } from "@/plugins/upload";
import { config } from "@/utils/config";
import { User } from "@/entities/User";

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

      const repo = req.em.getRepository(PdfUpload);

      const pdf = new PdfUpload();
      // the link must be joined by /
      pdf.link = [userId, filename].join("/");
      pdf.user = req.em.getReference(User, userId);

      await repo.persistAndFlush(pdf);

      req.log.info(`${fileRelativePath} persisted into database as ${pdf.id}.`);

      return { 201: { token: pdf.id } };

    },
  );
}
