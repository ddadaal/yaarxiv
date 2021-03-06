export default {
  "orm": {
    "type": "sqlite",
    "database": "./db.db",
  },
  "jwtSecret": "productionsecret",
  "mail": {
    "host": "<your mail service host>",
    "auth": {
      "user": "<your mail username>",
      "pass": "<your mail password>",
    },
  },
  "resetPassword": {
    "resetPageUrlTemplate": "<your frontend page for reset password, use {} as placeholder for token>",
  },
};
