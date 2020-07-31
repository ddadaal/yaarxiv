const { getConfig } = require("./src/utils/config");

module.exports = getConfig((c) => c.typeorm);
