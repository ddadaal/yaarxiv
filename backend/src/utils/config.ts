import defaultConfig from "../../configs/default.json";
import devConfig from "../../configs/dev.json";
import testConfig from "../../configs/test.json";
import prodConfig from "../../configs/prod.json";
import pino from "pino";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let config: any;

export function applyConfigurations() {
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

  config = { ...defaultConfig, ...extraConfig };

  if (config.logger !== false) {
    const logger = pino({ prettyPrint: true });
    logger.info(`Read config: \n ${JSON.stringify(config, null, 2)}`);
  }
}

// access id path on the config object
export function getConfig<T>(id: string): T {
  return id.split(".").reduce((prev, curr) => prev[curr], config);
}
