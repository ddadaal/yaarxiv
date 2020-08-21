import schemas from "yaarxiv-api/schemas.json";

// Add $id and title to every schema
function addIdAndTitle(obj: object) {
  for (const key in obj) {
    obj[key].$id = key;
    obj[key].title = key;
  }
}

// Change the $ref to the format `${id}#`
function changeRef(obj: object) {
  if (typeof obj === "object") {
    for (const key in obj) {
      if (key === "$ref") {
        const refValue = obj[key] as string;
        const value = refValue.split("/").slice(2).join("/");
        obj[key] = `${value}#`;
      } else {
        changeRef(obj[key]);
      }
    }
  }
}

[schemas.models, schemas.routes].forEach(addIdAndTitle);
changeRef(schemas);

export const { routes, models } = schemas;
