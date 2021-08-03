import { UploadedFile } from "@/entities/UploadedFile";
import { EntityManager } from "@mikro-orm/mysql";
import createError from "fastify-error";

const FileTokenInvalidError = createError("YAARXIV_INVALID_FILE_TOKEN", "File Token is invalid", 400);

export async function validateFileToken(em: EntityManager, token: number): Promise<UploadedFile> {

  const pdf = await em.findOne(UploadedFile, token);

  if (!pdf) {
    throw new FileTokenInvalidError();
  }

  return pdf;
}


