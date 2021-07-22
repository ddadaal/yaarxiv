import type { ConfigOverride } from "@/utils/config";

export default {
  port: 0,
  loadSwagger: false,
  orm: {
    type: "mysql",
    host: "localhost",
    port: 3306,
    dbName: `yaarxiv_test_${process.env.JEST_WORKER_ID}`,
    username: "root",
    password: "dbfordev",
    synchronize: true,
    dropSchema: true,
  },
  logger: {
    level: "error",
    prettyPrint: true,
  },
  upload: {
    path: "testupload",
  },
} as ConfigOverride;
