/* eslint-disable @typescript-eslint/no-var-requires */
const withPlugins = require("next-compose-plugins");
const images = require("next-images");
const tm = require("next-transpile-modules");

module.exports = withPlugins([
  [tm([
    "yaarxiv-api",
    "react-async",
    "react-typed-i18n",
  ])],
  [images, {}],
], {
  publicRuntimeConfig: {
    clientApiRoot: process.env.CLIENT_API_ROOT,
    serverApiRoot: process.env.SERVER_API_ROOT,
    staticFileRoot: process.env.STATIC_FILE_ROOT,
  },
});
