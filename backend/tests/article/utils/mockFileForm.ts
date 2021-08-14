import fs from "fs";
import path from "path";
import FormData from "form-data";
import { getActualFilePath } from "tests/utils/fs";

export function mockFileForm(size: number, filename: string = "test.pdf") {
  const formData = new FormData();
  formData.append("file", Buffer.alloc(size, 1), {
    filename,
    contentType: "application/pdf",
    knownLength: size,
  });
  return formData;
}

export async function createFile(size: number, filePath: string) {

  const fullPath = getActualFilePath(filePath);

  await fs.promises.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.promises.writeFile(
    fullPath,
    Buffer.alloc(size),
  );
}
