import routeSchemas from "yaarxiv-api/routeSchemas.json";
import models from "yaarxiv-api/models.json";

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

[routeSchemas, models].forEach(addIdAndTitle);
[routeSchemas, models].forEach(changeRef);

export { routeSchemas, models };
