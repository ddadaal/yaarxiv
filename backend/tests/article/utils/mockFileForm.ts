import fs from "fs";
import path from "path";
import FormData from "form-data";

export function mockFileForm(size: number) {
  const formData = new FormData();
  formData.append("file", Buffer.alloc(size, 1), {
    filename: "test.pdf",
    contentType: "application/pdf",
    knownLength: size,
  });
  return formData;
}

export async function createFile(size: number, filePath: string) {
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
  await fs.promises.writeFile(
    filePath,
    Buffer.alloc(size),
  );
}
