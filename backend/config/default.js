// @ts-check

/** @type {import("../src/utils/config").Config} */
const config = {
  address: "0.0.0.0",
  pluginTimeout: 30000,
  port: 5000,
  defaultPageSize: 10,
  loadSwagger: true,
  logger: true,
  jwtSecret: "testsecret",
  orm: {
    connectionTimeout: 20000,
    type: "mysql",
    debug: true,
    highlight: true,
  },
  upload: {
    path: "upload",
  },
  staticPrefix: "static",
  bcryptSaltLength: 10,
  mail: {
    secure: true,
    from: "yaarxiv",
    ignoreError: true,
  },
  frontendUrl: "http://localhost:5000",
  resetPassword: {
    resetPagePathnameTemplate: "/forget/reset?token={}",
    tokenValidTimeSeconds: 1800,
  },
  emailValidation: {
    pathnameTemplate: "/register/emailValidation?token={}",
    timeoutSeconds: 120 * 60,
    sendIntervalSeconds: 30 * 60,
  },
};

module.exports = config;
