// @ts-check

/** @type {import("../src/utils/config").ConfigOverride} */
const config = {
  loadSwagger: true,
  orm: {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "dbfordev",
    dbName: "yaarxiv_dev",
  },
  mail: false,
  logger: {
    level: "trace",
    prettyPrint: true,
  },
};

module.exports = config;
