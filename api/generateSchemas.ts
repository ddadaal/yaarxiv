/* eslint-disable @typescript-eslint/no-unused-vars */
import * as tsj from "ts-json-schema-generator";
import * as fs from "fs";
import readline from "readline";
import { EOL } from "os";
import path from "path";
import json5 from "json5";

const fsp = fs.promises;

const routeSchemasFile = "routeSchemas.json";
const modelsFile = "models.json";

function stringify(obj: object): string {
  return JSON.stringify(obj, null, 2);
}

async function start() {
  // generate all definitions
  const allDefinitions = tsj
    .createGenerator({ path: "!(node_modules)/**/*.ts", jsDoc: "extended", expose: "all" })
    .createSchema()
    .definitions;

  const routeSchemas: typeof allDefinitions = {};
  const models: typeof allDefinitions = {};
  for (const key in allDefinitions) {
    if (key.endsWith("Schema")) {
      routeSchemas[key] = allDefinitions[key];
    } else {
      models[key] = allDefinitions[key];
    }
  }

  await fsp.writeFile(routeSchemasFile, stringify(routeSchemas));
  await fsp.writeFile(modelsFile, stringify(models));

}

start();
