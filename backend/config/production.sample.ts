export default {
  orm: {
    host: "localhost",
    port: 3306,
    username: "root",
    password: "dbfordev",
    dbName: "yaarxiv_prod",
  },
  jwtSecret: "productionsecret",
  mail: {
    host: "<your mail service host>",
    auth: {
      user: "<your mail username>",
      pass: "<your mail password>",
    },
  },
  resetPassword: {
    resetPageUrlTemplate: "http://localhost:5000/forget/reset?token={}",
  },
};
