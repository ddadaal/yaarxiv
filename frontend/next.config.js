const tm = require("next-transpile-modules");
const withPlugins = require('next-compose-plugins');
const images = require('next-images')

module.exports = withPlugins([
  [tm, ["yaarxiv-api"]],
  [images, {}]
]);
