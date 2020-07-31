import defaultConfig from "configs/default.json";
import devConfig from "configs/dev.json";
import testConfig from "configs/test.json";
import prodConfig from "configs/prod.json";
import pino from "pino";

let config = (() => {
  const extraConfig = (() => {
    switch (process.env.NODE_ENV) {
    case "development":
    case "dev":
      return devConfig;
    case "test":
      return testConfig;
    case "production":
      return prodConfig;
    }})();

  const config = { ...defaultConfig, ...extraConfig };

  if (config.logger !== false) {
    const logger = pino({ prettyPrint: true });
    logger.info(`Read config: \n ${JSON.stringify(config, null, 2)}`);
  }

  return config;
})();

export type Config = typeof config;

export function getConfig<T>(fn: (c: Config) => T): T {
  return fn(config);
}

export function updateConfig(newConfig: Partial<Config>) {
  config = { ...config, ...newConfig };
}

export function getConfigFromId<T>(id: string): T {
  return id.split(".").reduce((prev, curr) => prev[curr], config);
}
