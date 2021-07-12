import { route } from "@/utils/route";
import path from "path";
import * as api from "yaarxiv-api/api/article/uploadPDF";
import { UploadedFile } from "@/entities/UploadedFile";
import { saveFile } from "@/plugins/upload";
import { config } from "@/utils/config";

// Save uploaded pdf to /{uploadPath}/{userId}/{current date}_{filename}
export const uploadPdfRoute = route(
  api, undefined,
  async (req) => {

    const data = await req.file({
      limits: {
        fileSize: api.PDF_SIZE_LIMIT_MB * 1024 * 1024,
      },
    });

    const user = req.dbUserRef();

    const filename =`${Date.now()}_${data.filename}`;
    const fileRelativePath = path.join(user.id + "", filename);

    const filePath = path.join(config.upload.path, fileRelativePath);

    req.log.info(`Received file ${data.filename} from ${user.id}.
      Saving it to ${filePath}.`);

    await saveFile(data, filePath);

    req.log.info(`${filePath} saved successfully.`);

    const pdf = new UploadedFile();
    // the link must be joined by /
    pdf.filePath = [user.id, filename].join("/");
    pdf.user = user;

    await req.em.persistAndFlush(pdf);

    req.log.info(`${fileRelativePath} persisted into database as ${pdf.id}.`);

    return { 201: { token: pdf.id } };

  },
);
