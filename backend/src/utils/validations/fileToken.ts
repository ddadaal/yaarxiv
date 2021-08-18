import { UploadedFile } from "@/entities/UploadedFile";
import { EntityManager } from "@mikro-orm/mysql";

export async function validateFileToken(em: EntityManager, token: number): Promise<UploadedFile | null> {

  const pdf = await em.findOne(UploadedFile, token);

  if (!pdf) {
    throw undefined;
  }

  return pdf;
}


