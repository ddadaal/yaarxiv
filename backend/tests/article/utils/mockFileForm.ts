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
