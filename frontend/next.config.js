/* eslint-disable @typescript-eslint/no-var-requires */
const withPlugins = require("next-compose-plugins");
const images = require("next-images");
const tm = require("next-transpile-modules");

module.exports = withPlugins([
  [tm([
    "yaarxiv-api",
    "react-async",
  ])],
  [images, {}],
], {
  publicRuntimeConfig: {
    clientApiRoot: process.env.CLIENT_API_ROOT,
    serverApiRoot: process.env.SERVER_API_ROOT,
    serverStaticFileRoot: process.env.SERVER_STATIC_FILE_ROOT,
    pdfSizeLimit: process.env.PDF_SIZE_LIMIT,
  },
});
