module.exports = {
  apps: [
    {
      name: "wtwr-api",
      script: "app.js",
      watch: false,
      env: {
        PORT: "3001",
        MONGO_URI:
          "mongodb://wtwrAdmin:ChangeThisPasswordNow123!@127.0.0.1:27017/wtwr_db?authSource=admin",
        JWT_SECRET: "dev-secret",
      },
    },
  ],
};
