import config from "config";

export function getConfig(id: string): any {
  return config.get(id);
}

export { config };
