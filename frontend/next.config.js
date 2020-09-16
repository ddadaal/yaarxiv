const tm = require("next-transpile-modules")([
  "yaarxiv-api",
  "react-notification-system",
  "react-async",
]);
const withPlugins = require("next-compose-plugins");
const images = require("next-images");

module.exports = withPlugins([
  [tm],
  [images, {}],
], {
  publicRuntimeConfig: {
    apiRoot: process.env.API_ROOT,
    staticRoot: process.env.STATIC_ROOT,
    pdfSizeLimit: process.env.PDF_SIZE_LIMIT,
  },
});
