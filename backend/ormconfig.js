const config = require("config");
const { entities } = require("src/entities");

module.exports = {
  ...config.typeorm,
  entities,
};
