import * as home from "./home";
import * as login from "./login";
import * as article from "./article";
import { SchemaObject } from "yaarxiv-api";

export const routes = [
  home.homeRoutes,
  login.loginRoutes,
  article.loginRoutes,
];

function addRefsWithExternalId(obj: object) {
  if (typeof obj === "object") {
    for (const key in obj) {
      if (key === "$ref") {
        const refValue = obj[key] as string;
        const value = refValue.split("/").slice(2).join("/");
        obj[key] = `${value}#`;
      } else {
        addRefsWithExternalId(obj[key]);
      }
    }
  }
}

function createDefinitionsObject(...schemaObjects: SchemaObject[]): object[] {
  const definitions = [];
  for (const schema of schemaObjects) {
    for (const key in schema) {
      addRefsWithExternalId(schema[key]);
      if (key === "Schema") { continue; }
      (schema[key] as any).$id = key;
      definitions.push(schema[key]);
    }
  }
  return definitions;
}

export const externalSchemas = createDefinitionsObject(
  article.schema,
);


