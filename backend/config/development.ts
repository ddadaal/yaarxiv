import type { ConfigOverride } from "@/utils/config";

export default {
  loadSwagger: true,
  orm: {
    host: "localhost",
    port: 3306,
    username: "root",
    password: "dbfordev",
    dbName: "yaarxiv_dev",
  },
  mail: false,
  logger: {
    level: "trace",
    prettyPrint: true,
  },
} as ConfigOverride;
