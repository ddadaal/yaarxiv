import { route } from "@/core/route";
import * as api from "yaarxiv-api/api/article/uploadScript";
import { UploadedFile } from "@/entities/UploadedFile";
import { extname } from "path";
import createError from "fastify-error";
import { genId } from "@/utils/genId";

const ScriptFormatError = createError(
  "YAARXIV_SCRIPT_FORMAT_ERROR",
  `Only ${api.ALLOWED_SCRIPT_FORMAT.join(", ")} are allowed`,
  400);

// Save uploaded file to /{userId}/temp/{a random id}.{ext}
// The uploaded file will be moved to corresponding folder by routes
export const uploadScriptRoute = route(
  api, undefined,
  async (req, fastify) => {

    const data = await req.file({
      limits: {
        fileSize: api.SCRIPT_SIZE_LIMIT_MB * 1024 * 1024,
      },
    });

    const ext = extname(data.filename);
    // extname returns .pdf. substr removes .
    if (!api.ALLOWED_SCRIPT_FORMAT.includes(ext.substr(1))) {
      throw new ScriptFormatError();
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
