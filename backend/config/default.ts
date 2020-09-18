export default {
  "port": 3000,
  "loadSwagger": true,
  "logger": true,
  "jwtSecret": "testsecret",
  "typeorm": {
    "logging": true,
    "migrations": [
      "migrations/*.ts",
    ],
    "cli": { "migrationsDir": "migrations" },
    "connectionTimeout": 20000,
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
  },
  "resetPassword": {
    "resetPageUrlTemplate": "http://localhost:5000/forget/reset?token={}",
    "tokenValidTimeSeconds": 1800,
  },
};
