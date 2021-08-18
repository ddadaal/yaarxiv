import schemas from "yaarxiv-api/schemas.json";

export const FILE_SCHEMA_REF = "#file";

// Add $id and title to every schema
function addIdAndTitle(obj: object) {
  for (const key in obj) {
    obj[key].$id = key;
    obj[key].title = key;
  }
}

// Change the $ref to the format `${id}#`
// And record the name of schemas which has a file property
const schemasWithFile = [] as string[];
function changeRef(schema: object, name?: string) {
  if (typeof schema === "object") {
    for (const key in schema) {
      if (key === "$ref") {
        if (schema[key] === "#/definitions/File" && name) {
          schemasWithFile.push(name);
        } else {
          const refValue = schema[key] as string;
          const value = refValue.split("/").slice(2).join("/");
          schema[key] = `${value}#`;
        }
      } else {
        changeRef(schema[key], name);
      }
    }
  }
}

[schemas.models, schemas.routes].forEach(addIdAndTitle);
Object.entries(schemas.routes).forEach(([name, schema]) => changeRef(schema, name));
Object.entries(schemas.models).forEach(([,schema]) => changeRef(schema, undefined));

// Clear the whole body field for schemas with a file property
schemasWithFile.forEach((schemaName) => {
  schemas.routes[schemaName]["properties"]["body"] = undefined;
});


export const { routes, models } = schemas;
