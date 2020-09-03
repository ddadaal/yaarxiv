import fs from "fs-extra";

const targetFolder = "dist";

const requiredItems = [
  "out",
  "config",
  "migrations",
  "ormconfig.js",
  "migrations",
  "package.json",
  "package-lock.json",
  "tsconfig.json",
];


async function run() {
  await fs.remove(targetFolder);
  await fs.mkdir(targetFolder);

  for (const item of requiredItems) {
    await fs.copy(item, targetFolder + "/" + item);
  }
}
run();
