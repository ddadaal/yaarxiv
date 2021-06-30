import { route } from "@/utils/route";
import path from "path";
import * as api from "yaarxiv-api/article/uploadPDF";
import { PdfUpload } from "@/entities/PdfUpload";
import { UploadedFile } from "@/plugins/upload";
import { config } from "@/utils/config";

// Save uploaded pdf to /{uploadPath}/{userId}/{current date}_{filename}
export const uploadPdfRoute = route(
  api, "UploadPDFSchema",
  async (req) => {
    const data = req.body.file as UploadedFile;

    const user = req.dbUserRef();

    const filename =`${Date.now()}_${data.name}`;
    const fileRelativePath = path.join(user.id + "", filename);

    const filePath = path.join(config.upload.path, fileRelativePath);

    req.log.info(`Received file ${data.name} from ${user.id}.
      Saving it to ${filePath}.`);

    await data.mv(filePath);

    req.log.info(`${filePath} saved successfully.`);

    const pdf = new PdfUpload();
    // the link must be joined by /
    pdf.link = [user.id, filename].join("/");
    pdf.user = user;

    await req.em.persistAndFlush(pdf);

    req.log.info(`${fileRelativePath} persisted into database as ${pdf.id}.`);

    return { 201: { token: pdf.id } };

  },
);
