import { route } from "@/utils/route";
import * as api from "yaarxiv-api/api/article/uploadPDF";
import { UploadedFile } from "@/entities/UploadedFile";

// Save uploaded pdf to /{userId}/{current date}_{filename}
export const uploadPdfRoute = route(
  api, undefined,
  async (req, fastify) => {

    const data = await req.file({
      limits: {
        fileSize: api.PDF_SIZE_LIMIT_MB * 1024 * 1024,
      },
    });

    const user = req.dbUserRef();

    const filename =`${Date.now()}_${data.filename}`;

    const pdf = new UploadedFile();
    pdf.filename = filename;
    pdf.user = user;

    const filePath = pdf.filePath;
    req.log.info(`
      Received file ${data.filename} from ${user.id}. Saving it to ${filePath}.
    `);
    await fastify.storage.saveFile(filePath, data.file);

    await req.em.persistAndFlush(pdf);

    req.log.info(`${filePath} persisted into database as ${pdf.id}.`);

    return { 201: { token: pdf.id } };

  },
);
