import FormData from "form-data";

export function mockFileForm(size: number, filename: string = "test.pdf") {
  const formData = new FormData();
  formData.append("file", Buffer.alloc(size, 1), {
    filename,
    contentType: "application/pdf",
    knownLength: size,
  });
  return formData;
}
