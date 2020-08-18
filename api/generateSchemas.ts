/* eslint-disable @typescript-eslint/no-unused-vars */
import * as tsj from "ts-json-schema-generator";
import * as fs from "fs";
import readline from "readline";
import { EOL } from "os";
import path from "path";
import json5 from "json5";

const fsp = fs.promises;

const SECTION_BEGIN = "// ======= Auto-generated JSON schema begin =======";
const SECTION_END = "// ======= Auto-generated JSON schema end =======";

const json5Options = {
  space: 2,
  quote: "\"",
};

function generateSchema(filename: string): string {
  const schema = tsj
    .createGenerator({ path: filename, jsDoc: "extended", expose: "all" })
    .createSchema();
  const schemaString = json5.stringify(schema.definitions, json5Options);
  return schemaString;

}

async function writeToFile(filename: string) {

  const lineReader = readline.createInterface({ input: fs.createReadStream(filename) });

  const schemeConstant = "export const schema = " + generateSchema(filename) + ";";

  let newContent = "";
  let insideBlock = false;
  let hasOverriden = false;
  for await (const line of lineReader) {
    if (!insideBlock) {
      newContent += line;
      newContent += EOL;
    }
    if (line === SECTION_BEGIN) {
      insideBlock = true;
      newContent += schemeConstant;
      newContent += EOL;
      newContent += SECTION_END;
      hasOverriden = true;
    } else if (line === SECTION_END) {
      insideBlock = false;
    }
  }
  if (!hasOverriden) {
    newContent += EOL;
    newContent += SECTION_BEGIN;
    newContent += EOL;
    newContent += schemeConstant;
    newContent += EOL;
    newContent += SECTION_END;
    newContent += EOL;
  }
  await fsp.writeFile(filename, newContent);
}

async function walk(dir: string) {
  for await (const d of await fsp.opendir(dir)) {
    const entry = path.join(dir, d.name);
    if (d.isDirectory()) {
      await walk(entry);
    }
    else if (d.isFile() && d.name.endsWith(".ts")) {
      console.log(`Generating schema and writing for ${entry}...`);
      await writeToFile(entry);
    }
  }
}
async function start() {
  for (const file of await fsp.readdir(".")) {
    if (file !== "node_modules" && (await fsp.stat(file)).isDirectory()) {
      await walk(file);
    }
  }
}

start();
