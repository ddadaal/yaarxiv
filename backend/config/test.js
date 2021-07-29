// @ts-check

/** @type {import("../src/utils/config").ConfigOverride} */
const config = {
  orm: {
    type: "mysql",
    host: "localhost",
    port: 3306,
    dbName: `yaarxiv_test_${process.env.JEST_WORKER_ID}`,
    user: "root",
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
};

module.exports = config;
