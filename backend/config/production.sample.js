// @ts-check

/** @type {import("../src/utils/config").ConfigOverride} */
const config = {
  orm: {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "dbfordev",
    dbName: "yaarxiv_prod",
  },
  jwtSecret: "productionsecret",
  mail: {
    host: "<your mail service host>",
    auth: {
      user: "<your mail username>",
      pass: "<your mail password>",
    },
  },
  frontendUrl: "http://localhost:5000",
};

module.exports = config;
