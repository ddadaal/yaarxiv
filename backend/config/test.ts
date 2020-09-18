export default {
  "port": 0,
  "loadSwagger": false,
  "orm": {
    "host": "localhost",
    "port": 3306,
    "dbName": `yaarxiv_test_${Date.now()}`,
    "user": "root",
    "password": "dbfordev",
    "dropSchema": true,
  },
  "logger": {
    "level": "info",
    "prettyPrint": true,
  },
  "upload": {
    "path": "testupload",
  },
};
