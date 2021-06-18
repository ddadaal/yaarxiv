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
    apiRoot: process.env.API_ROOT,
    staticRoot: process.env.STATIC_ROOT,
    pdfSizeLimit: process.env.PDF_SIZE_LIMIT,
  },
});
