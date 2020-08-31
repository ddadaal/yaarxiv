const tm = require("next-transpile-modules")(["yaarxiv-api"]);
const withPlugins = require('next-compose-plugins');
const images = require('next-images')

module.exports = withPlugins([
  [tm],
  [images, {}]
], {
  env: {
    USE_MOCK: process.env.USE_MOCK,
    API_ROOT: process.env.API_ROOT,
  }
});
