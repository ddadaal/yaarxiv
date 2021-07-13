import fs from "fs";
import path from "path";
import ts from "typescript";
import { EOL } from "os";
import { ESLint } from "eslint";

const eslintMaxLen = "/* eslint-disable max-len */";
const sharedProjectName = "yaarxiv-api";
const frontendPath = "../frontend";
const apiFile = "src/apis/api.ts";

const getFileNameInfo = (filename: string) => {
  const parts = filename.split(".");

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const ext = parts.pop()!;

  return [parts.join("."), ext];
};

async function getApiObject(rootDir: string, imports: [string, string][]): Promise<ts.ObjectLiteralExpression> {
  const subObjects = [] as ts.ObjectLiteralElementLike[];

  for (const f of await fs.promises.readdir(rootDir)) {
    const p = path.join(rootDir, f);

    const stat = await fs.promises.stat(p);

    const [filename, ext] = getFileNameInfo(f);

    if (stat.isFile()) {
      if (ext === "ts") {
        // read the file and get the schema name
        const sourceFile = ts.createSourceFile(
          p,
          await fs.promises.readFile(p, "utf8"),
          ts.ScriptTarget.Latest,
        );

        // find the interface with name ending with "Schema"
        const interfaceStatement = sourceFile.statements.find((x) =>
          ts.isInterfaceDeclaration(x) && x.name.text.endsWith("Schema") && x.name.text.length > "Schema".length);

        if (interfaceStatement) {
          const interfaceName = (interfaceStatement as ts.InterfaceDeclaration).name.text;

          const schemaName = interfaceName.slice(0, interfaceName.length - "Schema".length);

          const propertyName = schemaName[0].toLocaleLowerCase() + schemaName.slice(1);

          imports.push([
            propertyName,
            path.join(sharedProjectName, path.dirname(p), filename).split("\\").join("/"),
          ]);


          subObjects.push(ts.factory.createPropertyAssignment(
            propertyName,
            ts.factory.createCallExpression(
              ts.factory.createIdentifier("fromApi"),
              undefined, [
                ts.factory.createIdentifier(propertyName + ".endpoint"),
              ],
            ),
          ));
        }
      }
    } else {
      const apiObject = await getApiObject(p, imports);

      // ignore empty object
      let count = 0;
      apiObject.forEachChild(() => count++);
      if (count > 0) {
        subObjects.push(ts.factory.createPropertyAssignment(
          f, apiObject,
        ));
      }
    }
  }

  return ts.factory.createObjectLiteralExpression(subObjects, true);

}

async function main() {

  const imports = [] as [string, string][];
  const apiObject = await getApiObject("./api", imports);

  const apiObjDeclaration = ts.factory.createVariableStatement(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createVariableDeclarationList([

      ts.factory.createVariableDeclaration(
        "realApi",
        undefined,
        undefined,
        apiObject,
      ),
    ], ts.NodeFlags.Const),
  );

  const fetchApiImportDeclaration = ts.factory.createImportDeclaration([], [],
    ts.factory.createImportClause(false, undefined,
      ts.factory.createNamedImports([
        ts.factory.createImportSpecifier(undefined, ts.factory.createIdentifier("fromApi")),
      ]),
    ),
    ts.factory.createStringLiteral("./fetch"),
  );

  const importDeclarations = imports.map(([file, importPath]) => (
    ts.factory.createImportDeclaration([], [],
      ts.factory.createImportClause(false, undefined,
        ts.factory.createNamespaceImport(ts.factory.createIdentifier(file)),
      ),
      ts.factory.createStringLiteral(importPath),
    )
  ));

  const printer = ts.createPrinter();

  const dummySourceFile = ts.createSourceFile(apiFile, "", ts.ScriptTarget.Latest);

  function getString(node: ts.Node) {
    return printer.printNode(
      ts.EmitHint.Unspecified,
      node,
      dummySourceFile);
  }

  const content =
    eslintMaxLen +
    EOL +
    getString(fetchApiImportDeclaration) +
    EOL + EOL +
    importDeclarations.map(getString).join(EOL) +
    EOL + EOL +
    getString(apiObjDeclaration);

  // lint
  const eslint = new ESLint({
    cwd: path.resolve(frontendPath),
    fix: true,
  });

  const [result] = await eslint.lintText(content);

  await fs.promises.writeFile(path.join(frontendPath, apiFile), result.output + EOL, { flag: "w+" });
}



main();
