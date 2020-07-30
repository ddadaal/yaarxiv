import * as tsj from "ts-json-schema-generator";
import fs from "fs";
import path from "path";

const srcPath = "./types";
const outputPath = "./schemas";

async function walk(dir: string) {
  for await (const d of await fs.promises.opendir(dir)) {
    const entry = path.join(dir, d.name);
    if (d.isDirectory()) {
      walk(entry);
    }
    else if (d.isFile() && d.name.endsWith(".d.ts")) {
      console.log(`Generating ${entry}...`);
      const schema = tsj.createGenerator({ path: entry }).createSchema();

      const schemaString = JSON.stringify(schema, null, 2);

      const relativePath = path.relative(srcPath, entry);
      // strip .d.ts
      const filename = d.name.split(".").slice(0, -2).join(".");

      const target = path.join(outputPath, path.dirname(relativePath), `${filename}.json`);

      await fs.promises.mkdir(path.dirname(target), { recursive: true });
      await fs.promises.writeFile(target, schemaString);
    }
  }
}

walk(srcPath);
