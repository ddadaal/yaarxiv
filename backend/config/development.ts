import type { ConfigOverride } from "@/utils/config";

export default {
  "loadSwagger": true,
  "orm": {
    "type": "mysql",
    "host": "localhost",
    "port": 3306,
    "username": "root",
    "password": "dbfordev",
    "dbName": "yaarxiv_dev",
    "logging": true,
  },
  "logger": {
    "level": "trace",
    "prettyPrint": true,
  },
} as ConfigOverride;
