import { route } from "@/core/route";
import * as api from "yaarxiv-api/api/article/uploadScript";
import { UploadedFile } from "@/entities/UploadedFile";
import { extname } from "path";
import { genId } from "@/utils/genId";
import { ALLOWED_SCRIPT_FORMAT } from "yaarxiv-api/api/article/models";

// Save uploaded file to /{userId}/temp/{a random id}.{ext}
// The uploaded file will be moved to corresponding folder by routes
export const uploadScriptRoute = route(
  api, "UploadScriptSchema",
  async (req, fastify) => {

    const data = await req.file({
      limits: {
        fileSize: api.SCRIPT_SIZE_LIMIT_MB * 1024 * 1024,
      },
    });

    // extname returns .pdf. substr removes .
    const ext = extname(data.filename).substr(1);
    if (!(ALLOWED_SCRIPT_FORMAT as readonly string[]).includes(ext)) {
      return { 400: { code: "SCRIPT_FORMAT_ERROR" } } as const;
    }

    const user = req.dbUserRef();
    const filePath =`${user.id}/temp/${genId()}.${ext}`;

    const pdf = new UploadedFile({
      user, filePath, time: new Date(),
    });

    req.log.info(`
      Received file ${data.filename} from ${user.id}. Saving it to ${filePath}.
    `);

    await fastify.storage.saveFile(filePath, data.file);

    await req.em.persistAndFlush(pdf);

    req.log.info(`${filePath} persisted into database as ${pdf.id}.`);

    return { 201: { token: pdf.id } };

  },
);
