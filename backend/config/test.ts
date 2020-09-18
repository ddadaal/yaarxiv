export default {
  "port": 0,
  "loadSwagger": false,
  "typeorm": {
    "type": "mysql",
    "host": "localhost",
    "port": 3306,
    "database": `yaarxiv_test_${Date.now()}`,
    "username": "root",
    "password": "dbfordev",
    "synchronize": true,
    "dropSchema": true,
    "logging": [
      "schema",
      "query",
      "error",
    ],
  },
  "logger": {
    "level": "error",
    "prettyPrint": true,
  },
  "upload": {
    "path": "testupload",
  },
};