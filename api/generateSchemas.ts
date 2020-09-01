import * as tsj from "ts-json-schema-generator";
import * as fs from "fs";

const fsp = fs.promises;

const schemasFile = "schemas.json";

function stringify(obj: object): string {
  return JSON.stringify(obj, null, 2);
}

async function start() {
  // generate all definitions
  const allDefinitions = tsj
    .createGenerator({ path: "!(node_modules|out)/**/*.ts", jsDoc: "extended", expose: "all" })
    .createSchema()
    .definitions;

  const routeSchemas: typeof allDefinitions = {};
  const models: typeof allDefinitions = {};
  for (const key in allDefinitions) {
    if (key === "File" || key === "Blob") { continue; }
    if (key.endsWith("Schema")) {
      routeSchemas[key] = allDefinitions[key];
    } else {
      models[key] = allDefinitions[key];
    }
  }

  await fsp.writeFile(schemasFile, stringify({ routes: routeSchemas, models: models }));

}

start();
