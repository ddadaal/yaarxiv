import defaultConfig from "../../configs/default.json";
import devConfig from "../../configs/dev.json";
import testConfig from "../../configs/test.json";
import prodConfig from "../../configs/prod.json";

function isCamelCase(str: string) {
  return !!str.match(/^[a-z]+[A-Z]/);
}

function camelToSnakeCase(str: string) {
  if ( isCamelCase(str) ) {
    return str.replace(/[A-Z]/g, "\_$&");
  }
  return str;
}

// eslint-disable-next-line @typescript-eslint/ban-types
function apply(obj: object, root: string[] = []) {
  for (const key in obj) {
    const base = [...root, camelToSnakeCase(key).toUpperCase()];
    const name = base.join("_");
    let value = obj[key];

    if (Array.isArray(value)) {
      value = value.join(",");
    }

    switch (typeof value) {
    case "object":
      apply(value, base);
      break;
    case "boolean":
      value = value ? 1 : 0;
      // fallthrough
    case "string":
    case "number":
    case "bigint":
      console.log(`Setting env: ${name} = ${value}`);
      process.env[name] = value;
      break;
    case "undefined":
    case "function":
    case "symbol":
      // ignored
      break;
    }

  }
}


export function applyConfigurations() {
  // apply configurations
  // 1. apply default

  apply(defaultConfig);

  // 2. apply env specific configurations
  switch (process.env.NODE_ENV) {
  case "development":
  case "dev":
    apply(devConfig);
    break;
  case "test":
    apply(testConfig);
    break;
  case "production":
    apply(prodConfig);
    break;
  }
}


type ValueStringType = "string" | "number" | "boolean";
type ValueType<T extends ValueStringType> =
  T extends "string" ? string :
  T extends "number" ? number :
  T extends "boolean" ? boolean :
  unknown;

export function getConfig<T extends ValueStringType>(id: string, type: T): ValueType<T> {
  const value = process.env[id];
  if (typeof value === "undefined") {
    throw new Error(`Get undefined value of config id ${id}`);
  }

  if (type === "string") {
    return value as ValueType<T>;
  } else if (type === "number") {
    return Number(value) as ValueType<T>;
  } else if (type === "boolean") {
    return (value !== "0") as ValueType<T>;
  }
}