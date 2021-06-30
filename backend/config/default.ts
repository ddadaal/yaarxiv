import type { Config } from "@/utils/config";

export default {
  "address": "0.0.0.0",
  "pluginTimeout": 30000,
  "port": 3000,
  "defaultPageSize": 10,
  "loadSwagger": true,
  "logger": true,
  "jwtSecret": "testsecret",
  "orm": {
    "logging": true,
    "connectionTimeout": 20000,
    type: "mysql",
    debug: true,
    highlight: true,
  },
  "upload": {
    "path": "upload",
    "maxFileSize": 5242880,
  },
  "staticPrefix": "static",
  "bcryptSaltLength": 10,
  "mail": {
    "pool": true,
    "secure": true,
    from: "yaarxiv",
    ignoreError: true,
  },
  "resetPassword": {
    "resetPageUrlTemplate": "http://localhost:5000/forget/reset?token={}",
    "tokenValidTimeSeconds": 1800,
  },
} as Config;
